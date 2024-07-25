// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import connectToMongoDB from "../../../lib/db";
import { getServerSession } from 'next-auth'; // Adjust according to your setup
import { authOptions } from "../auth/[...nextauth]/route";
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    const { client, bucket } = await connectToMongoDB();

    // Get session information
    const session = await getServerSession({ req, res: NextResponse, ...authOptions });
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Read raw image data
        const buffer = Buffer.from(await req.arrayBuffer());
        if (!buffer) {
            return NextResponse.json({ message: 'No image data received' }, { status: 400 });
        }

        // Generate a unique filename and buffer
        const imageName = `${Date.now()}-${new ObjectId()}`;
        const stream = Readable.from(buffer);

        // Create a writable stream to GridFS
        const uploadStream = bucket.openUploadStream(imageName, {
            metadata: {
                contentType: req.headers.get('Content-Type'),
                uploadedBy: session.user?.email || 'unknown',
                createdAt: new Date()
            },
        });

        stream.pipe(uploadStream);

        return new Promise((resolve, reject) => {
            uploadStream.on('error', (err) => {
                console.error('Error uploading file:', err);
                reject(NextResponse.json({ message: 'Error uploading file' }, { status: 500 }));
            });

            uploadStream.on('finish', () => {
                const imageURL = `${process.env.NEXTAUTH_URL}/api/images/${uploadStream.id}`;
                resolve(NextResponse.json({ imageURL }));
            });
        });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ message: 'Error creating post' }, { status: 500 });
    }
}
