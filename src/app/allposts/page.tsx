"use client"

import React from "react"
import ShowAllPosts from "../components/Posts/Posts"
// import ShowAllPosts from "../components/crud/showPosts/ShowPosts";


export default function getAllPosts() {
    return (
        <div className="bg-neutral-100">
        <h1>All Posts</h1>
        <ShowAllPosts />
        </div>
    )
}