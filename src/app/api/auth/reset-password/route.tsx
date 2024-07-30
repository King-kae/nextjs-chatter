// pages/api/auth/reset-password.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import connectToMongoDB  from '@/lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { token, password } = req.body;

    try {
      const { client } = await connectToMongoDB();
      const user = await User.findOne({ resetToken: { token } });
      const resetToken = await db.collection('resetTokens').findOne({ token });

      if (!resetToken) {
        return res.status(400).json({ message: 'Invalid or expired reset token.' });
      }

      if (new Date() > resetToken.expiresAt) {
        return res.status(400).json({ message: 'Reset token has expired.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db.collection('users').updateOne(
        { _id: new ObjectId(resetToken.userId) },
        { $set: { password: hashedPassword } }
      );

      await db.collection('resetTokens').deleteOne({ _id: resetToken._id });

      res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
}
