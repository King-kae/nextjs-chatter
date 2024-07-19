"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useUsers from "../../hook/useUsers";
import Head from "next/head";
// import UserBio from "@/components/User/UserBio";
import Avatar from "../../components/Avatar";
import Image from "next/image";
// import PostFeed from "@/components/shared/PostFeed";
// import usePosts from "@/hooks/usePosts";
// import TabSwitcher from "@/components/tabs";

export default function UserId({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { userId } = params;

  const { data: user } = useUsers(userId as string);
//   const { data: posts = [] } = usePosts();

//   const post = posts.filter(
//     (post: Record<string, any>) => post.userId === userId
//   );

//   const tabs = [
//     { label: "Posts", content: <PostFeed data={post} /> },
//     { label: "About", content: <div>Content for Tab 2</div> },
//     { label: "Replies", content: <div>Content for Tab 3</div> },
//   ];
    console.log(user)

  return (
    <>
      <Head>
        <title>{user?.userId}</title>
      </Head>
      <div className="relative">
        <div className=" w-full h-40">
          <Image
            alt="Banner"
            src={
              user?.avatar ||
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80"
            }
            width={1000}
            height={300}
            className="object-cover w-fullh-48"
          />
        </div>
        <div className="absolute top-40 left-5">
          <Avatar size="large" />
        </div>
        {/* <UserBio /> */}
      </div>

      {/* <TabSwitcher tabs={tabs} /> */}
    </>
  );
}
