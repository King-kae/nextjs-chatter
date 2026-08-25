import React from 'react';
import Image from 'next/image';

export const PostImage = (props: any) => {
  if (!props.src) return null;
  if (props.link) {
    return (
      <div className={`${props.className} overflow-hidden`}>
        <a href={props.link} className="block">
          <Image
            className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-72"
            width={768}
            height={300}
            src={props.src}
            alt={props.alt}
          />
        </a>
      </div>
    );
  }
  return (
    <div className={`${props.className} overflow-hidden`}>
      <Image
        className="h-56 w-full object-cover sm:h-72"
        width={768}
        height={300}
        src={props.src}
        alt={props.alt}
      />
    </div>
  );
};
