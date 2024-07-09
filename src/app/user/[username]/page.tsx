import React from 'react';

interface UserPageProps {
  params: {
    username: string;
  };
}

export default function UserPage({ params }: UserPageProps) {
  const { username } = params;
  return <h1>Hello {username}, Next.js!</h1>;
}