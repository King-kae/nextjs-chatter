import React from 'react';

export const AuthorInfo = ({ author, date, status }: { author: any, date: any, status: string }) => {
  if (status === 'preview') {
    return (
      <div className="leading-tight">
        <p className="text-sm font-semibold text-ink-900">{author?.name || author?.username}</p>
        <p className="text-xs text-ink-400">{date}</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {author.bio && (
        <div>
          <p className="text-ink-700">{author.bio}</p>
        </div>
      )}
      {author.skills && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-400">Skills / Languages</h4>
          <p className="text-ink-700">{author.skills}</p>
        </div>
      )}
      {author.location && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-400">Location</h4>
          <p className="text-ink-700">{author.location}</p>
        </div>
      )}
      {author.work && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-400">Work</h4>
          <p className="text-ink-700">{author.work}</p>
        </div>
      )}
      {author.doB && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-400">Joined</h4>
          <p className="text-ink-700">{author.doB}</p>
        </div>
      )}
    </div>
  );
};
