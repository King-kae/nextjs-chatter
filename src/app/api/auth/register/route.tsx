// import User from '../../../models/user';
// import bcrypt from 'bcrypt';
// import mongoose from 'mongoose';
// import dotenv from "dotenv";
// dotenv.config();

// export async function POST(req: any) {
//     const body = await req.json();
//     await mongoose.connect(process.env.MONGO_URL || '');
//     const pass = body.password;
//     if (!pass?.length || pass.length < 5) {
//       new Error('password must be at least 5 characters');
//     }
  
//     const notHashedPassword = pass;
//     const salt = await bcrypt.genSaltSync(10);
//     body.password = bcrypt.hashSync(notHashedPassword, salt);
  
//     const createdUser = await User.create(body);
//     return Response.json(createdUser);
// }


import { NextResponse } from 'next/server';
import User from "../../../../models/user"
import connectToMongoDB from "../../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    
    const { username, email, password } = await request.json();
    console.log(username, email, password);
    if ( !username )  return NextResponse.json({ message: 'Username is required' }, { status: 400 });
    if( !email ) return NextResponse.json({ message: 'Email is required' }, { status: 400 });

    if (!password || password.length < 6) return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });

    try {
        
        await connectToMongoDB();
        const userFound = await User.findOne({ email });

        if (userFound) return NextResponse.json({ message: 'Email already exists' }, { status: 400 });

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({ username, email, password: hashedPassword });

        const savedUser = await user.save();
        console.log(savedUser);

        return NextResponse.json({
            _id: savedUser._id,
            email: savedUser.email,
            username: savedUser.username,
        });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return NextResponse.json(
                {
                    message: error.message,
                },
                {
                    status: 400,
                }
            );
        }
    }
}