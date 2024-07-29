"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { marked } from 'marked';

// interface EditPostProps {
//     post: {
//         title: string;
//         content: string;
//         imageURL: string;
//     };
// }


export default function EditPostPage({params,}: { params: Record<string, string>}) {
    const router = useRouter();
    const { title } = params;

    const [newTitle, setNewTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [imageURL, setImageURL] = useState<string>('');


    const getPost = async (title: string) => {
        const response = await fetch(`/api/post/${title}`);
        const data = await response.json();
        return data;
    };

    const { data, error, isLoading, isError } = useQuery({
        queryKey: ['post', title],
        queryFn: () => getPost(title),
    });
    console.log(data)
    

    useEffect(() => {
        if (data) {
          setNewTitle(data.title);
          setContent(data.content);
          setImageURL(data.imageURL);
        }
      }, [data]
    );

    const updatePost = async () => {
        if (!data) return;

        const response = await fetch(`/api/posts/${data.title}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newTitle, content, imageURL }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to update post');
        }
        return response.json();
      };
    
      const mutation = useMutation({
        mutationFn: updatePost, 
        onSuccess: () => {
          router.push(`/allposts/${newTitle}`);
        },
      });
    
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
      };
    
      if (isLoading) return <p>Loading...</p>;
      if (error) return <p>Error: {error.message}</p>;
    
    return (
        <>
            <h1>Here</h1>
            <div>
                <h1>Edit Post</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={data.title}
                            // onChange={(e) => setNewTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="content">Content:</label>
                        <textarea
                            id="content"
                            value={data.content}
                            // onChange={(e) => setContent(e.target.value)}
                        ></textarea>
                    </div>
                    <button type="submit">Update Post</button>
                </form>
            </div>
        </>
    )
}

