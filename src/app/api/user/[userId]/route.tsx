import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectToDB from '../../../../lib/db'
import User from '../../../../models/user'; // Adjust the path to your User model
import {authOptions} from '../../auth/[...nextauth]/route'

export async function GET(request: any, { params }: { params: { userId: string } }) {
    const { req, res } = request;
    const { userId } = params;
    try {
        // Connect to database
        const { client } = await connectToDB();
    
        const user = await User.findById({ _id: userId });

        if (!user) {
            return NextResponse.json({ status: "error", message: "User not found"},{ status: 404});
        }
        
        const followerCount = await User.countDocuments({
            following: userId,
        }).exec();

        return NextResponse.json({
            ...user.toObject(),
            followerCount,
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ status: "error", message: "Internal server error"},{ status: 500});
    }
}
