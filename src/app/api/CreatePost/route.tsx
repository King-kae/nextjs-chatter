import Post from "../../../models/post";
import User from "../../../models/user";
import { getServerSession } from "next-auth";
import connectToMongoDB from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";




// POST /api/post
// Required fields in body: title
// Required fields in body: content


// POST function to handle the request
export async function POST(req: NextRequest, res: NextApiResponse) {
    const { client, bucket } = await connectToMongoDB();

    const session = await getServerSession({ req: Request, res: NextResponse, ...authOptions });
    // console.log(session);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await User.findOne({ email: session.user?.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Handle file upload
        const formData = await req.formData();

        // Extract fields directly from formData
        const title = formData.get('title') as string;
        const file = formData.get('image') as File;
        const content = formData.get('content') as string;

        if (!title || !file) {
            return NextResponse.json({ message: 'Title or image file is missing' }, { status: 400 });
        }

        const imageName = `${Date.now()}-${file.name}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = Readable.from(buffer);

        const uploadStream = bucket.openUploadStream(imageName, {
            metadata: {
                contentType: file.type,
                title,
                content,
                author: user._id,
                createdAt: new Date()
            },
        });
        stream.pipe(uploadStream);

        uploadStream.on('error', () => {
            return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
        });

        uploadStream.on('finish', async () => {
            const imageURL = `${process.env.NEXTAUTH_URL}/api/images/${uploadStream.id}`;

            const newItem = new Post({
                title,
                content,
                author: user._id,
                imageURL: imageURL,
                titleURL: `${process.env.NEXTAUTH_URL}/${session.user?.name}/${title}`
            });
            await newItem.save();
            console.log(newItem);
            return NextResponse.json({ message: 'ok' });
        });
        return NextResponse.json({ message: 'ok' });
    } catch (error) {
        return NextResponse.json(
            { message: "Error creating post" },
            { status: 500 }
        );
    }
}


export default POST;