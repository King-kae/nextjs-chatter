import Post from "../../../models/post";
import connectToMongoDB from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export default async function GET() {
    const { client } = await connectToMongoDB();

    const session = await getServerSession(authOptions);
    console.log(session);

    return NextResponse.json(session);
}