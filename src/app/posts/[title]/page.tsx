// "use client";
// import React from "react";
// // import GetSinglePost from '../../components/crud/getSinglePost/GetSinglePost'
// import { useQuery } from "@tanstack/react-query";
// import Link from "next/link";

// export default function PostDetails({params,}: { params: Record<string, string>}) {
//   const { title } = params;

//   const { data, error, isLoading, isError } = useQuery({
//     queryKey: ["post", title],
//     queryFn: () =>
//       fetch(`/api/getsinglepost/${title}`).then((res) => res.json()),
//   });
//   console.log(data);

//   { isLoading && <p>Loading...</p> }
//   return (
//     <>
//       <div>
//         <h1>Post Details</h1>
//         <h3>{data?.title}</h3>
//         <p>{data?.content}</p>
//         <p>{data?.author.email}</p>
//         <img
//           src={data?.imageURL}
//           alt={data?.title}
//           style={{ maxWidth: "100%" }}
//         />
//         <p>{title}</p>
//         <a href=""></a>
//         <Link href={`/posts/${title}/edit`}>Edit Post</Link>
//       </div>
//     </>
//   );
// }



// app/posts/[id]/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchComments, fetchPost } from '../../../lib/fetchPost';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import CommentForm from '../../components/CommentForm';

interface PostPageProps {
  params: { title: string };
}


export default function PostPage({ params }: PostPageProps) {
  const { title } = params;
  const { data: session } = useSession();
  const { data: post, error, isLoading } = useQuery({ 
    queryKey: ['post', title] , 
    queryFn: () => fetchPost(title),
  });
  const { data: comments, error: commentsError, isLoading: commentsLoading, refetch } = useQuery({
    queryKey: ['comments', title], 
    queryFn: () => fetchComments(title),
  });

  const [commentError, setCommentError] = useState<string | null>(null);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const handleCommentSubmit = async (content: string) => {
    try {
      const res = await fetch(`/api/getposts/${title}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
  
      if (!res.ok) {
        throw new Error('Error posting comment');
      }
  
      await res.json();
      // refetch(); // Refetch post data to get the latest comments
    } catch (err: any) {
      const error = err as Error;
      setCommentError(error.message);
    }
  };
 
  console.log(post);
  console.log(comments);
  

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <img src={post.imageURL} alt={post.title} style={{ maxWidth: '100%' }} />

      {session && <CommentForm postTitle={post.title} onCommentPosted={handleCommentSubmit} />}

      {commentError && <p>Error posting comment: {commentError}</p>}

      <h2>Comments</h2>
      {commentsLoading && <p>Loading comments...</p>}
      {comments.comments.length === 0 && <div>No comment</div>}
      {comments.comments.map((comment: any) => (
        <div key={comment._id}>
          <p>{comment.content}</p>
          <p>By: {comment?.author?.username}</p>
        </div>
      ))}
    </div>
  );
}