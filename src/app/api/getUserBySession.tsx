import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next"
import User from '../../models/user'; // Adjust the path to your User model
import { authOptions } from './auth/[...nextauth]/route'

export async function GET(request: any) {
    const { req, res } = request;

    try {
        // Get session
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return Response.json(
                {
                    status: "error",
                    message: "Session not found or expired"
                },
                {
                    status: 401
                }
            );
        }

        // Fetch user data based on session email
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return Response.json(
                {
                    status: "error",
                    message: "User not found"
                },
                {
                    status: 404
                }
            );
        }

        // Return success response with user data
        return Response.json(
            {
                status: "success",
                data: { user }
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error('Error fetching user data:', error);
        return Response.json(
            {
                status: "error",
                message: "Internal server error"
            },
            {
                status: 500
            }
        );
    }
}
export const getUserDetails = async () => {

    //@ts-ignore
    const authSession = await getAuthSession();

    if (authSession) {

        if (authSession.id) {

            //@ts-ignore
            const user = await withRetry(getUserInfo, 5, [{ _id: new ObjectId(authSession.id) }])
                .catch(err => null);

            return user;
        }
    }
}