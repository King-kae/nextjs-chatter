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
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment"
      ></textarea>
      <button type="submit">Post Comment</button>
    </form>
  );
};

export default CommentForm;
