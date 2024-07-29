"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useUsers from "../../hook/useUsers";
import Head from "next/head";
import UserBio from "../../components/User/UserBio";
import Avatar from "../../components/Avatar";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query"; 
import TabSwitcher from "../../components/tabs";
import { fetchUserPosts } from "@/lib/fetchPost";
import PostList from "@/app/components/PostList/PostList";

export default function UserId({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { userId } = params;

  const {
    data: posts,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userPosts"],
    queryFn: fetchUserPosts,
  });

  const { data: user } = useUsers(userId as string);


  const tabs = [
    { label: "Posts", content: <PostList items={posts} /> },
    { label: "About", content: <div>Content for Tab 2</div> },
    { label: "Replies", content: <div>Content for Tab 3</div> },
  ];
    console.log(user)

  return (
    <>
      <Head>
        <title>{user?.userId}</title>
      </Head>
      <div className="relative pb-5">
        <div className=" w-full h-40">
          <Image
            alt="Banner"
            src={
              user?.coverphoto ||
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80"
            }
            width={1000}
            height={300}
            className="object-cover w-full h-48"
          />
        </div>
        <div className="absolute top-40 left-5">
          <Avatar seed={userId} size="large" />
        </div>
        <UserBio params={{ userId }} />
      </div>

      <TabSwitcher tabs={tabs} />
    </>
  );
}
