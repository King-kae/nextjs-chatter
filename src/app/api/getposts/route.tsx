import Post from '../../../models/post';
import connectToMongoDB from "../../../lib/db";
import { NextResponse } from 'next/server';

// GET /posts

export async function GET() {
    try {
        await connectToMongoDB();
        
        // Fetch posts with selected fields
        const posts = await Post.find({}, 'title content');
        
        // Map posts to include `id` instead of `_id`
        const formattedPosts = posts.map(post => ({
            id: post._id,
            title: post.title,
            content: post.content
        }));
        
        console.log(formattedPosts);
        return NextResponse.json(formattedPosts, { status: 200 });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
    }
}


