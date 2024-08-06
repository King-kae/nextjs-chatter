"use client"

import React from "react"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import PostList from "../components/PostList/PostList"

const getPostByTag = async () => {
    try {
        const response = await axios.get("/api/tag");
        return response.data.data || [];
    } catch (error: any) {
        console.log(error);
        return { error: error.message };
    }
}