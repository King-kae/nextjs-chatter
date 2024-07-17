// import Post from "../../../models/post";
// import connectToMongoDB from "../../../lib/db";
// import { NextResponse } from 'next/server';

// // GET /posts/:title

// export async function GET({ params }) {
//     try {
//         await connectToMongoDB();

//         // Fetch post with selected fields
//         const post = await Post.findOne({ title: params.title }, 'title content author');
//         const formattedPost = post.map((post) => ({
//             id: post._id,
//             title: post.title,
//             content: post.content,
//             author: post.author
//         }))
//         return NextResponse.json(formattedPost, { status: 200 });
//     } catch (error) {
//         console.error('Error fetching post:', error);
//         return NextResponse.json({ message: 'Error fetching post' }, { status: 500 });
//     }
// }

import Post from "../../../models/post";
import connectToMongoDB from "../../../lib/db";
import { NextResponse } from "next/server";

// GET /posts/:title

export async function GET(
  request: Request,
  { params }: { params: Record<string, string> }
) {
  try {
    await connectToMongoDB();

    const { title } = params;

    if (!title) {
      return NextResponse.json(
        { message: "Title parameter is required" },
        { status: 400 }
      );
    }

    // Fetch post with selected fields
    const post = await Post.findOne({ title }, "title content author");

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const formattedPost = {
      id: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
    };

    return NextResponse.json(formattedPost, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { message: "Error fetching post", error: (error as Error).message },
      { status: 500 }
    );
  }
}
