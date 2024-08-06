import React from 'react';
import Link from 'next/link';
import { getRandomColor } from '@/lib/getRandomColor';

export const PostTags = ({ tags }: { tags: Array<{ name: string }> }) => {
  return (
    <ul className='preview__tags'>
      {tags &&
        tags.map((tag, i) => (
          <li key={i} className='preview__tag preview__tag--post'>
            <Link href={`/tags/${tag.name}`}>
              <span style={{ color: getRandomColor() }}>#</span>
              {tag.name}
            </Link>
          </li>
        ))}
    </ul>
  );
};