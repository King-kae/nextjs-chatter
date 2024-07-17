import Post from '../../../models/post';
import connectToMongoDB from "../../../lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';

// GET /posts

export const GET = async (req: NextRequest) => {
    try {
        const { client, bucket } = await connectToMongoDB();

        // Retrieve all posts from the database
        const posts = await Post.find().populate('author');

        if (!posts || posts.length === 0) {
            return NextResponse.json({ message: 'No posts found' }, { status: 404 });
        }

        // Prepare the posts data to include all fields
        const postsData = posts.map(post => ({
            id: post._id,
            title: post.title,
            content: post.content,
            imageURL: post.imageURL,
            author: {
                id: post.author._id,
                name: post.author.username,
                email: post.author.email,
            },
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }));
        console.log(postsData);

        return NextResponse.json({
            status: 'success',
            data: postsData,
        }, {
            status: 200,
        });

    } catch (error) {
        return NextResponse.json({ message: 'Error retrieving posts', error: error as unknown as string }, { status: 500 });
    }
};

export default GET;

