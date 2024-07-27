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
  const formattedDate = formatDate(date);
  console.log(formattedDate)
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
        </div>
        <div className="px-8">
          <a href={`/allposts/${title}`} className="title-link">
            <h2>{title}</h2>
          </a>
          {/* <PostTags tags={tags} /> */}
            <div className="flex pb-4">
              <LikeButton initialTitle={title} />
              <BookmarkButton initialTitle={title} />
            </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
