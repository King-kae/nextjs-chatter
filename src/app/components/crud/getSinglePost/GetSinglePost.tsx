// "use client";

// import React, { useState } from "react";
// import { useSession } from 'next-auth/react';
// import axios from 'axios';
// import { useQuery } from "@tanstack/react-query";


// const getSinglePost = async () => {
//     const response = await axios.get("/api/getsinglepost");
//     return response.data;
// }

// export 
// default function GetSinglePost() {
//     const { isPending, isError, data, error } = useQuery<any[]>({ 
//         queryKey: ["posts"],
//         queryFn: getSinglePost,
//     });
//     console.log(data);
//     if(isPending) return <div> Loading...</div>
//     if(isError) return <div> Error: {error.message}</div>
//     return (
//         <div>
//             <h1>Single Post</h1>
//             <ul>
//                 {data.map((post: { title: React.ReactNode; content: React.ReactNode; id: React.Key | null | undefined; }) => (
//                     <li key={post.id}>
//                         <h2>{post.title}</h2>
//                         <p>{post.content}</p>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     )
// }

"use client";

import React, { useState } from "react";
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";

const getSinglePost = async () => {
    const response = await axios.get("/api/getsinglepost?title=SpecificTitle"); // Adjust to pass the correct title or id
    return response.data;
}

export default function GetSinglePost() {
    const { isLoading, isError, data, error } = useQuery<{ title: string, content: string, author: string }>({ 
        queryKey: ["singlePost"],
        queryFn: getSinglePost,
    });
    
    console.log(data);
    
    if(isLoading) return <div> Loading...</div>;
    if(isError) return <div> Error: {error.message}</div>;
    
    return (
        <div>
            <h1>Single Post</h1>
            <div>
                <h2>Title: {data?.title}</h2>
                <p>Content: {data?.content}</p>
                <p>Author: {data?.author}</p>
            </div>
        </div>
    );
}
