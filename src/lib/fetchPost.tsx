interface Post {
    _id: string;
    title: string;
    content: string;
}
export async function fetchPost(title: string) {
    const res = await fetch(`/api/getposts/${title}`);
    if (!res.ok) {
      throw new Error('Post not found');
    }
    return res.json();
}

export async function fetchComments(title: string) {
    const res = await fetch(`/api/getposts/${title}/comments`);
    if (!res.ok) {
      throw new Error('Error fetching comments');
    }
    return res.json();
}
  
  export const fetchUserPosts = async (): Promise<Post[]> => {
    const res = await fetch('/api/getuserposts');
    if (!res.ok) {
      throw new Error('Error fetching user posts');
    }
    return res.json();
  };

  // src/lib/deletePostByTitle.ts
export const deletePostByTitle = async (title: string): Promise<void> => {
    const res = await fetch(`/api/getposts/${title}`, {
      method: 'DELETE',
    });
  
    if (!res.ok) {
      throw new Error('Error deleting post');
    }
    console.log('Post deleted');
  };
  