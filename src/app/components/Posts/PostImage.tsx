import React from 'react';
import Image from 'next/image';

export const PostImage = (props: any) => {
  if (props.link) {
    return (
      <div className={`preview__image ${props.className} p-8`}>
        <a href={props.link}>
          <Image width={400} height={300} src={props.src} alt={props.alt} />
        </a>
      </div>
    );
  }
  return (
    <div className={`post__image ${props.className}`}>
      <Image width={400} height={300} src={props.src} alt={props.alt} />
    </div>
  );
};