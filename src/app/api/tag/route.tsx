import Tag from "@/models/tag";
import Post from "../../../models/post";
import User from "../../../models/user";
import { getServerSession } from "next-auth";
import connectToMongoDB from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/utils/authOptions";
import { NextApiRequest, NextApiResponse } from "next";

// POST /api/tag

export async function POST(req: NextRequest, res: NextApiResponse) {
    console.log('here')
  const { client } = await connectToMongoDB();
  const session = await getServerSession({
    req: NextRequest,
    res: NextResponse,
    ...authOptions,
  });
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // const { name } = await req.json();
    // if (!name || typeof name !== 'string') {
    //     return NextResponse.json({ message: 'Invalid name' }, { status: 400 });
    // }

    // const tag = await Tag.findOne({ name });
    // if (tag) {
    //     return NextResponse.json({ message: 'Tag already exists' }, { status: 400 });
    // }

    // const newTag = new Tag({ name });
    // await newTag.save();
    
    const { tags, postId } = await req.json();

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    for (const tag of tags) {
      const postTag = await Tag.findOneAndUpdate(
        { name: tag.toLowerCase() },
        { $addToSet: { posts: post._id } },
        { upsert: true, new: true }
      );

      await Post.updateOne(
        { _id: post._id },
        { $addToSet: { tags: postTag._id } }
      );
    }

    return NextResponse.json({
      message: "Tags created and updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
