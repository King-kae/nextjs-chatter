"use client";

import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import PostList from "../PostList/PostList";

const getAllPosts = async () => {
  try {
      const response = await axios.get("/api/post");
      return response.data.data || [];
  } catch (error: any) {
      console.log(error);
      return { error: error.message }
  }
};

export default function ShowAllPosts() {
  const { isPending, isError, data, error } = useQuery<any[]>({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });
  console.log(data);
  if (isPending) return <div className="flex justify-center items-center h-screen"> Loading...</div>;
  if (isError) return <div> Error: {error.message}</div>;
  if (!data) return <div> No data</div>;

  
  return (
    <>
      {!data.length && <div> No data</div>}
      <div className="flex justify-center items-center h-full">
      <PostList items={data} />
      </div>
    </>
  );
}