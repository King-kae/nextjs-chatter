'use client'
// app/user/posts/page.tsx
import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchUserPosts, deletePostByTitle } from '../../lib/fetchPost';

export default function UserPosts() {
  const { data: posts, error, isLoading, refetch } = useQuery({
    queryKey: ['userPosts'],
    queryFn: fetchUserPosts
  });
  const mutation = useMutation({
    mutationFn: deletePostByTitle, 
    onSuccess: async () => {
      refetch(); // Refetch posts after a successful deletion
    },
  });
  console.log(posts)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Your Posts</h1>
      {posts?.map((post) => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <button onClick={() => mutation.mutate(post.title)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
