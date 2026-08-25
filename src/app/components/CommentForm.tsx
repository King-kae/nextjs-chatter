// CommentForm.tsx
import React, { useState } from 'react';

interface CommentFormProps {
  postTitle: string;
  onCommentPosted: (content: string) => Promise<void>; // Ensure onCommentPosted accepts a string argument
}

const CommentForm: React.FC<CommentFormProps> = ({ postTitle, onCommentPosted }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (content.trim() !== '') {
      await onCommentPosted(content); // Invoke onCommentPosted with content as argument
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
        className="w-full resize-none rounded-2xl border border-ink-200 p-4 text-sm text-ink-900 shadow-soft outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
      ></textarea>
      <button
        type="submit"
        className="self-end rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.03] active:scale-[0.98]"
      >
        Post comment
      </button>
    </form>
  );

};

export default CommentForm;
