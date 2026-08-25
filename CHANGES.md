# Chatter — Modernization Notes

This is a full pass over the original codebase: dependency upgrades, a
redesigned UI with motion, a fetch-based API layer, and cleanup of dead code.
This file explains what changed and why, so nothing here is a mystery.

## Stack upgrades

| Package     | Before  | Now      |
|-------------|---------|----------|
| Next.js     | 14.2.4  | 16.3.x   |
| React       | 18      | 19.2     |
| next-auth   | 4.x     | 4.24.15 (latest 4.x — v5/Auth.js is still in beta, so it was **not** adopted; see below) |
| TypeScript  | 5.4     | 5.9      |
| Tailwind CSS| 3.4     | 3.4.17 (stayed on v3 — v4 changes the config format entirely and wasn't worth the extra migration risk right now) |
| mongoose / mongodb | older | latest majors |

Removed entirely (they were declared in `package.json` but never actually
imported anywhere in the app): `antd`, `react-quill`, `quill`,
`@auth/mongodb-adapter`.

Added: `framer-motion` (animation), `lucide-react` (icon set used in the
redesign), `sonner` (toast notifications), `clsx` / `tailwind-merge`.

**Why not next-auth v5 / Auth.js?** It's still shipping as `5.0.0-beta.32`
with no stable release. Given the app needs to actually work, staying on the
latest stable v4 (4.24.15) was the safer call. If/when v5 goes stable, the
migration mainly touches `authOptions` → a single `auth()` export and the
~14 `getServerSession(authOptions)` call sites.

## Third-party signup

Google and GitHub OAuth sign-in still go through NextAuth's `signIn()` —
that logic wasn't touched, only restyled. Set `GOOGLE_ID`/`GOOGLE_SECRET`
and `GITHUB_ID`/`GITHUB_SECRET` in `.env.local` (see `.env.example`) to
enable them. `LoginModal` now reuses the same `GoogleButton`/`GithubButton`
components as the login page instead of duplicating the markup.

## HTTP layer — axios → fetch SDK

`axios` is gone. In its place, `src/lib/api.ts` exports a small `apiClient`
built on the native `fetch` API, with the same `.data` / thrown-on-error
ergonomics axios had, so the ~20 call sites that used it didn't need to be
rewritten one by one. SWR's fetcher was also switched off axios.

**A note on `FormData` uploads:** several call sites (post creation, cover/
avatar uploads, forgot-password) set an explicit
`headers: { "Content-Type": "multipart/form-data" }` when posting a
`FormData` body — a pattern carried over from axios, which silently drops
that header for `FormData` bodies so the browser can generate the required
`boundary` parameter itself. Native `fetch` does *not* do that — it honors
whatever `Content-Type` you give it, so a boundary-less header meant the
server's `req.formData()` failed to parse the body. `apiClient` now strips
any caller-supplied `Content-Type` specifically when the body is a
`FormData` instance, so the browser sets the correct one automatically.
This is fixed centrally in `api.ts`, so it covers every current and future
call site without needing to touch each one.

## Next.js 15/16 async `params`

Every dynamic route (pages and API handlers) was migrated to the new async
`params` API. Client page components use `useParams()` from
`next/navigation` instead of a `params` prop; API route handlers `await`
the `params` promise.

`middleware.tsx` was renamed to `proxy.tsx` per Next 16's updated
convention.

## Design system + motion

- New Tailwind theme: a warm coral/amber `brand` palette, `ink` neutrals,
  gradient/shadow utilities (`bg-brand-mesh`, `shadow-glow`, `shadow-soft`).
- New type pairing: **Space Grotesk** (display/headings) + **Plus Jakarta
  Sans** (body), loaded via `next/font/google`.
- `framer-motion` used for page-load transitions, the feed's staggered
  card entrance, an animated mobile nav drawer, animated tab underline, and
  small tap/hover feedback on like/bookmark buttons.
- Toasts moved to `sonner`, wrapped by the existing `useToast()` hook so
  every caller kept working unchanged.

Redesigned: landing page, header/footer, login/register/forgot/reset
password, the whole post feed (card, tags, list), single post view, post
editor + edit page, user profile + tabs, 404 page, and all social action
buttons.

## Dead code removed

These existed in the repo but were never linked to or imported from
anywhere reachable in the app, so they were deleted rather than dragged
along:

- `components/crud/*` (an old, broken, axios-based CRUD scaffold)
- `components/crud/getSinglePost` (pointed at an API route that doesn't exist)
- `/components` debug route (`"Hello, Next.js!"`)
- `/dashboard/profile` (its only link to it was commented out)
- `/upload` debug page (a rough duplicate of the real upload flow inside `/post`)
- `components/common/UserPanel.tsx` (only used by the removed dashboard route)
- the old bespoke `Toast.tsx` (superseded by `sonner`)

## Verifying it builds

A production build (`npx next build`) was run against this exact codebase
and completed successfully across all routes. The only thing that will
differ in your environment is that this sandbox has no outbound access to
`fonts.googleapis.com`, so font-fetching was stubbed out locally purely to
verify the rest of the build — the real `next/font/google` imports are back
in place in the delivered code and will fetch fonts normally wherever you
run `npm run dev` / `npm run build`.

## Image & video uploads — Cloudinary

Uploads used to go through a hand-rolled MongoDB GridFS pipeline
(`src/lib/db.tsx`'s `bucket`, streamed through `/api/images/[id]`). That's
now replaced by Cloudinary:

- `src/lib/cloudinary.ts` configures the official `cloudinary` SDK from
  `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`.
- `/api/upload` (used by the post editor for in-content images/videos, and
  by the profile editor for avatar/cover images) now streams the file
  straight to Cloudinary and returns its hosted `secure_url`. Response
  shape (`fileURL` / `imageURL`) is unchanged, so nothing on the client
  needed to be rewritten.
- `/api/post`'s POST handler (the actual "create a post" endpoint, which
  uploads the cover image as part of the form submission) was also moved
  off GridFS onto Cloudinary. While in there, a real bug was fixed: the
  old code returned its HTTP response *before* the GridFS upload's
  `finish` callback had actually run, so the post could be "created"
  before the save had finished. It's now a straightforward `await` chain.
- `next.config.mjs` now allows images from `res.cloudinary.com`.
- `/api/images/[id]` and the GridFS `bucket` in `src/lib/db.tsx` were left
  in place (not deleted) purely so any posts/avatars uploaded *before*
  this change keep working — nothing new writes through that path anymore.

Add your Cloudinary credentials to `.env.local` (see `.env.example`) — free
tier is enough for development.

## Layout / width fixes

Two real CSS bugs, now fixed:

1. `globals.css` had a leftover, overly broad rule —
   `@media (min-width: 1024px) { .container { max-width: 768px !important } }`
   — that was written for a video-embed sizing case but ended up capping
   *every* `.container` element in the app, including the post feed grid,
   to 768px wide on any screen ≥1024px. That's why cards looked squeezed
   with big empty margins unless the window was truly maximized. Removed;
   only the intended `.markdown-preview video` rule remains.
2. `PostList` was wrapping itself in an unconfigured Tailwind `.container`
   class (no `center`/`padding` set in `tailwind.config.ts`, so it doesn't
   center or pad — it just caps width and left-aligns), nested inside
   pages that *already* had their own centered `max-w-*` wrapper. That
   double-wrapping was the other source of the "not full width" look.
   `PostList` now renders a plain grid and inherits its width from
   whichever page places it.

Along the way, the feed/profile pages (`/allposts`, `/tags/[name]`,
`/user/[userId]`) were also widened from `max-w-5xl` to `max-w-6xl` to
match the header's width, and the grid now goes up to 3 columns
(`sm:grid-cols-2 xl:grid-cols-3`) on large screens so wide viewports are
actually put to use.

## Before you run it

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in `MONGODB_URL`,
   `NEXTAUTH_SECRET`, Cloudinary credentials, and (optionally) the
   Google/GitHub OAuth + email credentials.
3. `npm run dev`
