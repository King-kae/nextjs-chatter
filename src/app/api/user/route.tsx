// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import connectToDB from '../../../lib/db'
// import User from '../../../models/user'; // Adjust the path to your User model
// // import {authOptions} from '../auth/[...nextauth]/route'
// import { authOptions } from '@/utils/authOptions';
// import { NextApiResponse } from 'next';

// export async function GET(request: any) {
//     const { req, res } = request;
    
//     try {
//         // Connect to database
//         const { client } = await connectToDB();
//         // Get session
//         const session = await getServerSession({ req: request, res: NextResponse, ...authOptions });
        
//         if (!session?.user?.email) {
//             return NextResponse.json(
//                 {
//                     status: "error",
//                     message: "Session not found or expired"
//                 },
//                 {
//                     status: 401
//                 }
//             );
//         }

//         // Fetch user data based on session email (assuming it's stored in your User model)
//         const user = await User.findOne({ email: session.user.email });

//         if (!user) {
//             return NextResponse.json(
//                 {
//                     status: "error",
//                     message: "User not found"
//                 },
//                 {
//                     status: 404
//                 }
//             );
//         }

//         // Return success NextResponse with user data
//         return NextResponse.json(user);
//     } catch (error) {
//         console.error("Error fetching user data:", error);
//         return NextResponse.json(
//             {
//                 status: "error",
//                 message: "Internal server error"
//             },
//             {
//                 status: 500
//             }
//         );
//     }
// }

// export async function PUT(req: NextRequest, res: NextApiResponse) {
//     // const { req, res } = request;
    
//     try {
//         // Connect to database
//         const { client } = await connectToDB();
//         // Get session
//         const session = await getServerSession(authOptions);
        
//         if (!session?.user?.email) {
//             return NextResponse.json(
//                 {
//                     status: "error",
//                     message: "Session not found or expired"
//                 },
//                 {
//                     status: 401
//                 }
//             );
//         }

//         // Fetch user data based on session email (assuming it's stored in your User model)
//         const user = await User.findOne({ email: session.user.email });

//         if (!user) {
//             return NextResponse.json({ status: "error", message: "User not found"},{ status: 404 });
//         }

//         // Update user data
//         const { username, bio, location, work, skills, links, coverImage } = await req.json();
//         user.username = username;
//         user.bio = bio;
//         user.coverphoto = coverImage
//         user.location = location;
//         user.work = work;
//         user.skills = skills;
//         user.links = links;
//         await user.save();

//         // Return success NextResponse with updated user data
//         return NextResponse.json(user);
//     } catch (error) {
//         console.error("Error updating user data:", error);
//         return NextResponse.json(
//             {
//                 status: "error",
//                 message: "Internal server error"
//             },
//             {
//                 status: 500
//             }
//         );
//     }
// }


import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectToDB from '@/lib/db';
import User from '@/models/user'; // Adjust the path to your User model
import { authOptions } from '@/utils/authOptions';

// Force the route to be treated as dynamic
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        // Connect to the database
        const { client } = await connectToDB();

        // Get session
        const session = await getServerSession({ req, ...authOptions });

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json(
                { status: "error", message: "Session not found or expired" },
                { status: 401 }
            );
        }

        // Fetch user data based on session email
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                { status: "error", message: "User not found" },
                { status: 404 }
            );
        }

        // Return success response with user data
        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json(
            { status: "error", message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        // Connect to the database
        const { client } = await connectToDB();

        // Get session
        const session = await getServerSession({ req, ...authOptions });

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json(
                { status: "error", message: "Session not found or expired" },
                { status: 401 }
            );
        }

        // Fetch user data based on session email
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                { status: "error", message: "User not found" },
                { status: 404 }
            );
        }

        // Update user data
        const { username, bio, location, work, skills, links, coverImage } = await req.json();
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.location = location || user.location;
        user.work = work || user.work;
        user.skills = skills || user.skills;
        user.links = links || user.links;
        user.coverImage = coverImage || user.coverImage;

        await user.save();

        // Return success response with updated user data
        return NextResponse.json(user);
    } catch (error) {
        console.error("Error updating user data:", error);
        return NextResponse.json(
            { status: "error", message: "Internal server error" },
            { status: 500 }
        );
    }
}
