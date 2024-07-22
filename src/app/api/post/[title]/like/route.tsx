import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import connectToMongoDB from '../../../../../lib/db';
import Post from '../../../../../models/post';
import User from '../../../../../models/user';

// Handler for POST /api/posts/[title]/like (Like a post)
export async function POST(req: NextRequest, { params }: { params: { title: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title } = params;

    if (!title || typeof title !== 'string') {
        return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }

    await connectToMongoDB();

    try {
        const post = await Post.findOne({ title }).populate('author');

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const user = await User.findOne({ email: session.user?.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userId = user._id;
        if (!userId) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userHasLiked = post.likedIds.includes(userId);

        if (!userHasLiked) {
            post.likedIds.push(userId);
            await post.save();
        }

        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}

// Handler for DELETE /api/posts/[title]/like (Unlike a post)
export async function DELETE(req: NextRequest, { params }: { params: { title: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title } = params;

    if (!title || typeof title !== 'string') {
        return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }

    await connectToMongoDB();

    try {
        const post = await Post.findOne({ title }).populate('author');

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const user = await User.findOne({ email: session.user?.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userId = user._id;        if (!userId) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userHasLiked = post.likedIds.includes(userId);

        if (userHasLiked) {
            post.likedIds = post.likedIds.filter((id: string) => id !== userId);
            await post.save();
        }

        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}
