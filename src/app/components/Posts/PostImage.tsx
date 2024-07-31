import React from 'react';
import Image from 'next/image';

export const PostImage = (props: any) => {
  if (props.link) {
    return (
      <div className={`preview__image ${props.className} p-8`}>
        <a href={props.link}>
          <Image src={props.src} alt={props.alt} />
        </a>
      </div>
    );
  }
  return (
    <div className={`post__image ${props.className}`}>
      <Image src={props.src} alt={props.alt} />
    </div>
  );
};