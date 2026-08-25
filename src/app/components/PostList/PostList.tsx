"use client";

import React from "react";
import { motion } from "framer-motion";
import PostCard from "../Posts/PostCard";

const PostList = (props: any) => {
  return (
    <>
      {!props.isLoading && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {props.items &&
            props.items.map((post: any) => (
              <PostCard
                key={post._id}
                id={post._id}
                title={post.title}
                body={post.content}
                image={post.imageURL}
                date={post.date}
                author={props.author || post.author}
                tags={post.tags}
                views={post.views}
                titleURL={post.titleURL}
                likes={post.likes}
                bookmarks={post.bookmarks}
                comments={post.comments}
              />
            ))}
        </motion.div>
      )}
    </>
  );
};

export default PostList;
