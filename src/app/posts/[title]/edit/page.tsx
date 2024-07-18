"use client"
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import { GetServerSideProps } from 'next';
import Post from '../../../../models/post';
import { useQuery } from '@tanstack/react-query';
import connectToMongoDB from '../../../../lib/db';
import Link from 'next/link';

// interface EditPostProps {
//     post: {
//         title: string;
//         content: string;
//         imageURL: string;
//     };
// }

// const EditPostPage = ({params,}: { params: Record<string, string>}) => {
//     const router = useRouter();
//     const { title } = params;

// //   const { data, error, isLoading, isError } = useQuery({
// //     queryKey: ["post", title],
// //     queryFn: async () =>
// //       await fetch(`/api/getsinglepost/${title}`).then((res) => res.json()),
// //   });
// //   console.log(data);
// //   const { title, content, imageURL } = data;
//     // const [newTitle, setNewTitle] = useState(data.title);
//     // const [content, setContent] = useState(data.content);
//     // const [imageURL, setImageURL] = useState(data.imageURL);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         const response = await fetch(`/api/posts/${data.title}`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ newTitle: title, content, imageURL }),
//         });

//         if (response.ok) {
//             router.push(`/posts/${title}`);
//         } else {
//             console.error('Failed to update post');
//         }
//     };

//     return (
//         // <div>
//         //     <h1>Edit Post</h1>
//         //     <form onSubmit={handleSubmit}>
//         //         <div>
//         //             <label htmlFor="title">Title:</label>
//         //             <input
//         //                 type="text"
//         //                 id="title"
//         //                 value={newTitle}
//         //                 onChange={(e) => setNewTitle(e.target.value)}
//         //             />
//         //         </div>
//         //         <div>
//         //             <label htmlFor="content">Content:</label>
//         //             <textarea
//         //                 id="content"
//         //                 value={content}
//         //                 onChange={(e) => setContent(e.target.value)}
//         //             ></textarea>
//         //         </div>
//         //         <div>
//         //             <label htmlFor="imageURL">Image URL:</label>
//         //             <input
//         //                 type="text"
//         //                 id="imageURL"
//         //                 value={imageURL}
//         //                 onChange={(e) => setImageURL(e.target.value)}
//         //             />
//         //         </div>
//         //         <button type="submit">Update Post</button>
//         //     </form>
//         // </div>
//         <div>
//         <h1>Post Details</h1>
//         {isLoading && <p>Loading...</p>}
//         {isError && <p>Error: {String(error)}</p>}
//         {data && (
//           <>
//             <h3>{data.title}</h3>
//             <p>{data.content}</p>
//             <p>{data.author.email}</p>
//             <img
//               src={data.imageURL}
//               alt={data.title}
//               style={{ maxWidth: "100%" }}
//             />
//             <p>{title}</p>
//             {/* <a href=""></a> */}
//             <Link href={`/edit/${title}`}>Edit Post</Link>
//           </>
//         )}
//         </div>
//     );
// };

// export default EditPostPage;

export default function EditPostPage({params,}: { params: Record<string, string>}) {

    const router = useRouter();
    const { title } = params;
    const getPost = async (title: string) => {
        const response = await fetch(`/api/getsinglepost/${title}`);
        const data = await response.json();
        return data;
    };

    const { data, error, isLoading, isError } = useQuery({
        queryKey: ['post', title],
        queryFn: () => getPost(title),
    });
    console.log(data)
    
    if (isLoading) {
        return <p>Loading...</p>;
    }
    
    // const [newTitle, setNewTitle] = useState(data.title);
    // const [content, setContent] = useState(data.content);
        const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch(`/api/posts/${data.title}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newTitle: title, content, imageURL }),
        });

        if (response.ok) {
            router.push(`/posts/${title}`);
        } else {
            console.error('Failed to update post');
        }
    };

    
    return (
        <>
            <h1>Here</h1>
            <div>
                <h1>Edit Post</h1>
                <form>
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

