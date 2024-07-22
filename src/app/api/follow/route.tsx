import { NextApiRequest, NextApiResponse } from "next";
import {NextResponse} from "next/server";
import connectToMongoDB from '../../../lib/db';
import User from '../../../models/user';
import serverAuth from '../../../lib/serverAuth';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { currentUser } = await serverAuth(req, res);
        const { userId } = req.body;

        if (!userId || typeof userId !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const {client} = await connectToMongoDB();

        const user = await User.findById(userId).exec();

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!currentUser.following.includes(userId)) {
            currentUser.following.push(userId);
            await currentUser.save();
        }

        return NextResponse.json(currentUser, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 400 });
    }
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { currentUser } = await serverAuth(req, res);
        const { userId } = req.body;

        if (!userId || typeof userId !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const { client } = await connectToMongoDB();

        const user = await User.findById(userId).exec();

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        currentUser.following = currentUser.following.filter(
            (followingId: string) => followingId !== userId
        );
        await currentUser.save();

        return NextResponse.json(currentUser, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 400 });
    }
}
