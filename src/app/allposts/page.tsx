"use client"

import React from "react"
import ShowAllPosts from "../components/Posts/Posts"
import Header from "../components/Header"
import SearchComponent from "../SearchComponent"



export default function getAllPosts() {

    return (
        <>
            <Header />
            <div className="bg-neutral-100 h-full">
                <h1>All Posts</h1>
                <SearchComponent />
                <ShowAllPosts />
            </div>
        </>
    )
}