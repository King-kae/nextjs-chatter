"use client"
import React, { useState } from "react";
import axios from "axios";
import { useSession } from 'next-auth/react';


const handleSubmit = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
  // handle form submission
  e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const content = formData.get("content");
    
    
    try {
      const createPostResponse = await axios
      .post("/api/createpost", {
        title,
        content,
      })
      .then((res) => {
        console.log(res);
      });

      console.log(createPostResponse);

    } catch (err) {
        console.log(err);
    } 
};

export default function CreatePost() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { data: session, status } = useSession();

    { loading && (<div> your loading spinner or anything...</div>) }
    if (status === "unauthenticated") {
        return <p>You must be logged in to create a post</p>;
    }
    return (
    <main>
      <h1>Create Post, {session?.user?.name}</h1>
      <form onSubmit={handleSubmit}>
        <div className="">
          <label htmlFor="cover-photo">
          <input type="file" id="cover-photo" name="cover-photo" />
          <span>Add a 1000x250px</span>
          </label>
        </div>
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}


// pages/create-post.js
// import { useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// export default function CreatePost() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     const res = await fetch('/api/createpost', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ title, content }),
//     });
//     console.log(res);

//     if (res.ok) {
//       router.push('/');
//     } else {
//       console.error('Failed to create post');
//     }
//   };

//   if (!session) {
//     return <p>You must be logged in to create a post</p>;
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>Title</label>
//         <input
//           type="text"
//           name="title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//       </div>
//       <div>
//         <label>Content</label>
//         <textarea
//         name='content'
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           required
//         />
//       </div>
//       <button type="submit">Create Post</button>
//     </form>
//   );
// }
