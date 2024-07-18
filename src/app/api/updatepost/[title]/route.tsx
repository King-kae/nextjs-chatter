import Post from "../../../../models/post";
import connectToMongoDB from "../../../../lib/db";
import User from "../../../../models/user";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export default async function PATCH(req: NextRequest & { query: { title: string } }) {
    const { client } = await connectToMongoDB();

    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }


    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }


    const title = req.query.title as string;
    const { newTitle, content, imageURL } = await req.json();

    
    try {
        const post = await Post.findOne({ title });

        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        if (post.author.toString() !== (user._id as string)) {
            return NextResponse.json({ message: "You are not authorized to update this post" }, { status: 403 });
        }

        post.title = newTitle || post.title;
        post.content = content || post.content;
        post.imageURL = imageURL || post.imageURL;

        await post.save();

        return NextResponse.json(post);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error updating post" }, { status: 500 });
    }
}

// export default PATCH;