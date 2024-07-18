import NextAuth, { AuthOptions } from "next-auth";
// import { Adapter } from "next-auth/adapters";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
import User from "./models/user";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    jwt({ account, token, user, profile, session }) {
      if (user) token.user = user;
      return token;
    },
    session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
  providers: [
    // OAuth authentication providers...
    // Credentials authentication providers...
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "email", type: "text", placeholder: "" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("Invalid credentials.");
        }
      
        const email = credentials.email as string;
        const password = credentials.password as string;
      
        if (!email || !password) {
          throw new Error("Invalid credentials.");
        }
      
        // logic to verify if user exists
        const user = await User.findOne({ email: email });
      
        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error("User not found.");
        }
      
        // logic to salt and hash password
        const isMatch = await bcrypt.compare(password, user?.password!);
        if (!isMatch) {
          // Passwords don't match
          throw new Error("Password does not match.");
        }
        // return user object with the their profile data
        return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
        };
      },
    }),
  ],
});
