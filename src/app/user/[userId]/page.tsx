"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import useUsers from "@/app/hook/useUsers";
import Head from "next/head";
import UserBio from "../../components/User/UserBio";
import Avatar from "@/app/components/Avatar";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import TabSwitcher from "@/app/components/tabs";
import { fetchUserPosts } from "@/lib/fetchPost";
import PostList from "@/app/components/PostList/PostList";
import { apiClient } from "@/lib/api";
import Header from "@/app/components/Header";
import Loader from "@/app/components/Loader";


const getAllPosts = async () => {
  try {
    const response = await apiClient.get("/api/post");
    console.log(response.data.data)
    return response.data.data || [];
  } catch (error: any) {
    console.log(error.message);
    return { error: error.message };
  }
};
export default function UserId() {
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const userId = params.userId as string;

  const { isLoading, isError, data, error } = useQuery<any[]>({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  const posts = data?.filter((post) => post.author.id === userId);
  const bookmarks = data?.filter((post) => post.bookmarks.includes(userId));
  const { data: user } = useUsers(userId as string);

  const tabs = [
    { label: "Posts", content: <PostList items={posts} /> },
    { label: "Bookmarks", content: <PostList items={bookmarks} /> },
    { label: "Replies", content: <div>Content for Tab 3</div> },
  ];
  // console.log(user);
    if (isLoading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <Loader />
        </div>
      );
    }

  return (
    <>
      <Head>
        <title>{user?.username || "Profile"} · Chatter</title>
      </Head>
      <Header />
      <div className="pb-10">
        <div className="relative h-40 w-full overflow-hidden sm:h-56">
          <Image
            alt="Banner"
            src={
              user?.coverphoto ||
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80"
            }
            width={1200}
            height={400}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/30 to-transparent" />
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="-mt-12 sm:-mt-14">
            <Avatar seed={userId} size="large" />
          </div>
        </div>
        <UserBio params={{ userId }} />
      </div>

      <TabSwitcher tabs={tabs} />
    </>
  );
}
