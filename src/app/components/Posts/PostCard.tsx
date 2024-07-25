import React from "react";
import { AuthorInfo } from "../AuthorInfo/AuthorInfo";
import useCurrentUser from "../../hook/useCurrentUser";
import { PostImage } from "./PostImage";
import Avatar from "../Avatar";
import PreviewReactions from "./PreviewReactions";
import LikeButton from "../LikeButton";
import BookmarkButton from "../BookmarkButton";

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

  const { title, id, image, author, date, titleURL, tags, likes, bookmarks } = props;

  const createdAt = formatDate(date);
  return (
    <>
      <div className="">
        <PostImage
          link={titleURL}
          src={image}
          alt={title}
          className="post__image"
        />
        <div className="">
          <Avatar size="small" />
          <AuthorInfo status="preview" author={author} date={createdAt} />
        </div>
        <div className="">
          <a href={`/allposts/${title}`} className="title-link">
            <h2>{title}</h2>
          </a>
          {/* <PostTags tags={tags} /> */}
          {/* <PreviewReactions
            likes={likes}
          /> */}
            <LikeButton initialTitle={title} />
            <span>{likes && likes.length}</span>
            <BookmarkButton initialTitle={title} />
            <span>{bookmarks.length}</span>
        </div>
      </div>
    </>
  );
};

export default PostCard;
