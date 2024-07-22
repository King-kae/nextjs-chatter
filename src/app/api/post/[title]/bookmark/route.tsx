import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import connectToMongoDB from "../../../../../lib/db";
import Post from "../../../../../models/post";
import User from "../../../../../models/user";

// Handler for POST /api/posts/[title]/bookmark (Bookmark a post)
export async function POST(
  req: NextRequest,
  { params }: { params: { title: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title } = params;

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Invalid title" }, { status: 400 });
  }

  await connectToMongoDB();

  try {
    const post = await Post.findOne({ title }).populate("author");

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const foundUser = await User.findOne({ email: session.user?.email });
    if (!foundUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = foundUser._id;
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userHasBookmarked = user.bookmarks.includes(post._id);

    if (!userHasBookmarked) {
      user.bookmarks.push(post._id);
      await user.save();
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

// Handler for DELETE /api/posts/[title]/bookmark (Unbookmark a post)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { title: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title } = params;

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Invalid title" }, { status: 400 });
  }

  await connectToMongoDB();

  try {
    const post = await Post.findOne({ title }).populate("author");

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const foundUser = await User.findOne({ email: session.user?.email });
    if (!foundUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = foundUser._id;
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userHasBookmarked = user.bookmarks.includes(post._id);

    if (userHasBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (id: string) => id.toString() !== post._id.toString()
      );
      await user.save();
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
