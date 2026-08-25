'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/app/components/Header';
import Avatar from '@/app/components/Avatar';
import Loader from '@/app/components/Loader';
import { motion } from 'framer-motion';

const CommentsPage = () => {
  const [comments, setComments] = useState<{
      user: any;
      content: ReactNode; _id: string
}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams<{ title: string }>();
  const title = decodeURIComponent(params.title as string);

  useEffect(() => {
    if (!title) return;

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/post/${title}/comments`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setComments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [title]);

  return (
    <>
      <Header />
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-10 sm:px-6">
        <h1 className="mb-6 font-display text-2xl font-bold text-ink-950">
          Comments on <span className="text-brand-600">{title}</span>
        </h1>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        )}
        {error && <p className="text-rose-600">{error}</p>}
        {!loading && !error && comments.length === 0 && (
          <p className="text-ink-500">No comments available yet.</p>
        )}

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="space-y-4"
        >
          {comments.map((comment) => (
            <motion.div
              key={comment._id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft"
            >
              <div className="mb-2 flex items-center gap-2">
                <Avatar seed={comment.user?._id} size="small" />
                <h4 className="font-semibold text-ink-900">{comment.user?.username}</h4>
              </div>
              <p className="text-ink-700">{comment.content}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default CommentsPage;
