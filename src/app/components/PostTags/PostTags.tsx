import React from 'react';
import Link from 'next/link';

const tagColors = [
  'bg-brand-50 text-brand-700 hover:bg-brand-100',
  'bg-amber-50 text-amber-700 hover:bg-amber-100',
  'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
  'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
  'bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100',
];

export const PostTags = ({ tags }: { tags: Array<{ name: string }> }) => {
  if (!tags || tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2 list-none">
      {tags.map((tag, i) => (
        <li key={i}>
          <Link
            href={`/tags/${tag.name}`}
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              tagColors[i % tagColors.length]
            }`}
          >
            #{tag.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};
