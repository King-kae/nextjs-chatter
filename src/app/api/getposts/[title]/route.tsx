import Post from "../../../../models/post";
import connectToMongoDB from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/user";

// GET /posts/:title

export async function GET(req: NextRequest, { params }: { params: { title: string } }) {
  const { title } = params;

  if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
  }

  const { client } = await connectToMongoDB();

  try {
      const post = await Post.findOne({ title }).populate('author');

      if (!post) {
          return NextResponse.json({ message: 'Post not found' }, { status: 404 });
      }

      return NextResponse.json(post);
  } catch (error) {
      return NextResponse.json({ message: 'Error retrieving post', error }, { status: 500 });
  }
}



export async function DELETE(req: NextRequest, { params }: { params: { title: string } }) {
    const session = await getServerSession(authOptions);
    // console.log(session)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  
    await connectToMongoDB();
  
    try {
      const { title } = params;

      const user = await User.findOne({ email: session.user?.email });
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      const post = await Post.findOneAndDelete({ title, author: user._id });

      
      if (!post) {
        return NextResponse.json({ message: 'Post not found or unauthorized' }, { status: 404 });
      }
      
      return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
      // return console.log(post)
    } catch (error) {
      return NextResponse.json({ message: 'Error deleting post', error }, { status: 500 });
    }
}