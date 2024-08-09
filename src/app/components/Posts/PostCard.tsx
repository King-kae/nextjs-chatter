import React from "react";
import { AuthorInfo } from "../AuthorInfo/AuthorInfo";
import useCurrentUser from "../../hook/useCurrentUser";
import { PostImage } from "./PostImage";
import Avatar from "../Avatar";
import LikeButton from "../LikeButton";
import BookmarkButton from "../BookmarkButton";
import { PostTags } from "../PostTags/PostTags";
import CommentButton from "../CommentButton";
import { EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const formatDate = (date: string | number | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const today = new Date(date);

  return today.toLocaleDateString("en-US", options);
};

const PostCard = (props: any) => {
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?._id;
  // console.log(userId);
  const { title, id, views, image, tags, author, date, titleURL, comments } = props;
  // console.log(tags)
  const formattedDate = formatDate(date);
  // console.log(id);
  return (
    <>
      <div className="bg-white rounded-b-lg">
        <PostImage
          link={titleURL}
          src={image}
          alt={title}
          className="post__image"
        />
        <div className="flex gap-x-8 p-8">
          <Avatar seed={author.id} size="small" />
          <AuthorInfo status="preview" author={author} date={formattedDate} />
          <span>{views?.length || 0} View(s)</span>
          {userId === author.id && (
            <button className="px-2 bg-black">
              <Link href={`/allposts/${title}/edit`} className="text-white">Edit</Link>
            </button>
          )}
        </div>
        <div className="px-8">
          <Link href={`/allposts/${title}`} className="title-link">
            <h2 className="hover:text-blue-500 cursor-pointer">{title}</h2>
          </Link>
          <PostTags tags={tags} />
          <div className="flex pb-4">
            <CommentButton comments={comments} initialTitle={title} />
            <LikeButton initialTitle={title} />
            <BookmarkButton initialTitle={title} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
