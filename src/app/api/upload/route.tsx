// app/api/upload/route.ts
// Handles cover images, post images/videos, and avatar uploads by
// streaming the incoming file straight to Cloudinary (the "SDK" — no more
// hand-rolled GridFS storage) and returning its hosted URL.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const arrayBuffer = await req.arrayBuffer();
        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
            return NextResponse.json({ message: 'No data received' }, { status: 400 });
        }
        const buffer = Buffer.from(arrayBuffer);

        const contentType = req.headers.get('Content-Type') || 'application/octet-stream';
        const resourceType = contentType.startsWith('video') ? 'video' : 'image';

        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'chatter',
                    resource_type: resourceType,
                },
                (error, uploadResult) => {
                    if (error || !uploadResult) {
                        reject(error);
                        return;
                    }
                    resolve(uploadResult as { secure_url: string });
                }
            );
            uploadStream.end(buffer);
        });

        // fileURL / imageURL kept for backward compatibility with every
        // existing call site (post editor, avatar/cover upload, etc.)
        return NextResponse.json({
            fileURL: result.secure_url,
            imageURL: result.secure_url,
        });
    } catch (error: any) {
        console.error('Error uploading to Cloudinary:', error);
        const detail = error?.message || 'Unknown error';
        return NextResponse.json(
            { message: `Error uploading file: ${detail}` },
            { status: 500 }
        );
    }
}
