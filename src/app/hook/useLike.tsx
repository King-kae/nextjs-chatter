import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "./useToast"; // Assuming you have a toast hook for notifications

// export const useLike = (initialTitle: any) => {
//     const [liked, setLiked] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [title, setTitle] = useState(initialTitle);

//     const toggleLike = useCallback(async () => {
//         if (!title) {
//             setError('Title is required');
//             return;
//         }

//         setLoading(true);
//         setError(null);

//         try {
//             const response = await fetch('/api/post/like', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ title }),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.error || 'Something went wrong');
//             }

//             setLiked((prevLiked) => !prevLiked);
//         } catch (err) {
//             if (err instanceof Error) setError(err.message);
//             else setError('An unexpected error occurred');
//         } finally {
//             setLoading(false);
//         }
//     }, [title]);

//     return { liked, loading, error, toggleLike, setTitle };
// };

export const useLike = (initialTitle: any) => {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    if (!title) {
      setError("Title is required");
      setLoading(false);
      return;
    }

    const checkIfLiked = async () => {
      try {
        const response = await fetch("/api/post/checklike", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        setLiked(data.liked);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    checkIfLiked();
  }, [title]);

  const toggleLike = useCallback(async () => {
    if (!title) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/post/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setLiked((prevLiked) => !prevLiked);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [title]);

  return { liked, loading, error, toggleLike, setTitle };
};
