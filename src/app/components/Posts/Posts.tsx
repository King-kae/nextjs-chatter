"use client";

import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import PostList from "../PostList/PostList";

const getAllPosts = async () => {
  const response = await axios.get("/api/post");
  return response.data.data;
};

export default function ShowAllPosts() {
  const { isPending, isError, data, error } = useQuery<any[]>({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });
  console.log(data);
  if (isPending) return <div> Loading...</div>;
  if (isError) return <div> Error: {error.message}</div>;
  if (!data) return <div> No data</div>;

  
  return (
      <div>
          {/* <pre>
              {JSON.stringify(data, null, 2)}
          </pre> */}
      <PostList items={data} />
      </div>
  );
}