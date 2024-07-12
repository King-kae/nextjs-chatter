// import type { NextApiRequest, NextApiResponse } from 'next'
// import Post from '../../../models/post'
// import { getSession } from 'next-auth/react'
// import connectToMongoDB from "../../../lib/db";
// import { NextResponse } from 'next/server';


// // POST /api/post
// // Required fields in body: title
// // Required fields in body: content
// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//     await connectToMongoDB();
//     const { title, content } = req.body;
  
//     const session = await getSession({ req });
//     if (session) {
//       const result = await Post.create({
//           title: title,
//           content: content,
          // author: { connect: { email: session?.user?.email } },
//       });
//       return NextResponse.json(result);
//     } else {
//       return NextResponse.json(
//         {
//             message: 'Unauthorized',
//         },
//         {
//             status: 400,
//         }
//     );
//     }
//   }

import Post from '../../../models/post';
import User from '../../../models/user';
import { getServerSession } from 'next-auth';
import connectToMongoDB from "../../../lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { useState } from 'react'
import {authOptions} from '../auth/[...nextauth]/route'


// POST /api/post
// Required fields in body: title
// Required fields in body: content
export async function POST(request: { json: () => PromiseLike<{ title: any; content: any; }> | { title: any; content: any; }; }) {
    

    await connectToMongoDB();
    
    const { title, content } = await request.json();
     console.log({ title, content });

     const session = await getServerSession({ req: request, res: NextResponse, ...authOptions }); 
     console.log(session)
        if (session) {
        try {

          const user = await  User.findOne({ email: session.user?.email });
          if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

            const post =  Post.create({
                title: title,
                content: content,
                author: user._id,
                // author: user.name, // assuming you want to save the author's email
            });
            // const savedPost = await post.save();
            // console.log(post)
            return NextResponse.json(post);
        } catch (error) {
            return NextResponse.json({ message: 'Error creating post' });
        }
    } else {
        return NextResponse.json({ message: 'Unauthorized' });
    }
}
