"use client"

import React, { useState } from "react";
import { useSession } from 'next-auth/react';
import ShowAllPosts from "../components/crud/showPosts/ShowPosts";



export default function getAllPosts(title: string, content: string, author: string) {
  
    const { data: session, status } = useSession();
    if (status === "unauthenticated") {
        return <p>You must be logged in to view posts</p>;
    }
    return (
        <div>
        <h1>All Posts, {session?.user?.name}</h1>
        <ShowAllPosts />
        </div>
    );
}