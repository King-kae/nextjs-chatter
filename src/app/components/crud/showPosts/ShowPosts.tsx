'use client'

import React, { useState } from "react";
import axios from "axios";
import { useSession } from 'next-auth/react';
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";


const getAllPosts = async () => {
    const response = await axios.get("/api/getposts");
    return response.data;
}


export default function ShowAllPosts () {
    const { isPending, isError, data, error } = useQuery<any[]>({ 
        queryKey: ["posts"],
        queryFn: getAllPosts,
    });
    console.log(data);
    if(isPending) return <div> Loading...</div>
    if(isError) return <div> Error: {error.message}</div>
    return (
        <div>
            <h1>All Posts</h1>
            <ul>
                {data.map((post: { title: React.ReactNode; content: React.ReactNode; id: React.Key | null | undefined; }) => (
                    <li key={post.id}>
                        <h2>{post.title}</h2>
                        <Link href={`/posts/${post.title}`}></Link>
                        <p>{post.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}


