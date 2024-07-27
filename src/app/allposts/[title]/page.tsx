// app/posts/[id]/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPost } from "../../../lib/fetchPost";
import React, { ReactNode, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CommentForm from "../../components/CommentForm";
import Avatar from "@/app/components/Avatar";
import LikeButton from "@/app/components/LikeButton";
import BookmarkButton from "@/app/components/BookmarkButton";
import { marked } from "marked";

interface PostPageProps {
  params: { title: string };
}

// export default function PostPage({ params }: PostPageProps) {
//   const { title } = params;
//   const { data: session } = useSession();
//   const { data: post, error, isLoading } = useQuery({
//     queryKey: ['post', title] ,
//     queryFn: () => fetchPost(title),
//   });
//   const [comments, setComments] = useState<{
//     user: any;
//     content: ReactNode; _id: string
// }[]>([]);
// const [loading, setLoading] = useState(true);
// const [commentError, setCommentError] = useState<string | null>(null);

// useEffect(() => {
//   if (!title) return;

//   const fetchComments = async () => {
//     try {
//       const response = await fetch(`/api/post/${title}/comments`);
//       if (!response.ok) throw new Error('Failed to fetch');
//       const data = await response.json();
//       setComments(data);
//     } catch (err) {
//       setCommentError('errror fetching comments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchComments();
// }, [title]);

// if (loading) return <p>Loading comments...</p>;
// if (error) return <p>{commentError}</p>;
// if (comments.length === 0) return <p>No comments available</p>;

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {(error as Error).message}</div>;
//   }
//   const handleCommentSubmit = async (content: string) => {
//     try {
//       const res = await fetch(`/api/post/${title}/comments`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ content }),
//       });

//       if (!res.ok) {
//         throw new Error('Error posting comment');
//       }

//       await res.json();
//       // refetch(); // Refetch post data to get the latest comments
//     } catch (err: any) {
//       const error = err as Error;
//       setCommentError(error.message);
//     }
//   };

//   console.log(post);

//   return (
//     <div>
//       <h1>{post.title}</h1>
//       <img src={post.imageURL} alt={post.title} style={{ maxWidth: '100%' }} />
//       <p>{post.content}</p>
//       <div>
//       <LikeButton initialTitle={`${post.title}`} />
//       <BookmarkButton initialTitle={`${post.title}`} />
//       </div>

//       {session && <CommentForm postTitle={post.title} onCommentPosted={handleCommentSubmit} />}
//       {/* {commentError && <p>Error posting comment: {commentError}</p>} */}

//       <h2>Comments</h2>
//       <div>
//       {comments.map(comment => (
//         <div key={comment._id}>
//           <h4>{comment.user.username}</h4>
//           <p>{comment.content}</p>
//         </div>
//       ))}
//     </div>
//     </div>
//   );
// }

interface Comment {
  user: {
    [x: string]: string | undefined;
    avatar: string | undefined;
    username: string;
  };
  content: ReactNode;
  _id: string;
}

const fetchComments = async (title: string): Promise<Comment[]> => {
  const response = await fetch(`/api/post/${title}/comments`);
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  return response.json();
};

export default function PostPage({ params }: PostPageProps) {
  const { title } = params;
  const { data: session } = useSession();

  // Fetch post data
  const {
    data: post,
    error: postError,
    isLoading: postLoading,
  } = useQuery({
    queryKey: ["post", title],
    queryFn: () => fetchPost(title),
  });

  // Fetch comments data
  const {
    data: comments,
    error: commentsError,
    isLoading: commentsLoading,
    refetch,
  } = useQuery({
    queryKey: ["comments", title],
    queryFn: () => fetchComments(title),
  });

  // Handle comment submission
  const handleCommentSubmit = async (content: string) => {
    try {
      const res = await fetch(`/api/post/${title}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        throw new Error("Error posting comment");
      }

      await res.json();
      refetch(); // Optionally, refetch comments if needed
    } catch (err: any) {
      console.error("Error posting comment:", err.message);
    }
  };

  if (postLoading || commentsLoading) {
    return <div>Loading...</div>;
  }

  if (postError || commentsError) {
    return <div>Error: {(postError || commentsError)?.message}</div>;
  }
  const htmlContent = marked.parse(post.content)

  return (
    <div>
      <h1>{post.title}</h1>
      <img src={post.imageURL} alt={post.title} style={{ maxWidth: "100%" }} />
      {/* <p>{post.content}</p> */}
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent as string }}
        style={{ lineHeight: "1.5" }}
      />
      <div>
        <LikeButton initialTitle={post.title} />
        <BookmarkButton initialTitle={post.title} />
      </div>

      {session && (
        <CommentForm
          postTitle={post.title}
          onCommentPosted={handleCommentSubmit}
        />
      )}

      <h2>Comments</h2>
      <div>
        {comments?.length === 0 ? (
          <p>No comments available</p>
        ) : (
          comments?.map((comment) => (
            <div key={comment._id}>
              <Avatar seed={comment.user._id} size="small" />
              <h4>{comment.user.username}</h4>
              <p>{comment.content}</p>
            </div>
          )) ?? null
        )}
      </div>
    </div>
  );
}
