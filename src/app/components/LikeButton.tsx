import React, { useState } from 'react';
import { useLike } from '../hook/useLike'; // Update the path according to your project structure

const LikeButton = ({ initialTitle }: { initialTitle: string }) => {
    const { liked, likeCount, loading, error, toggleLike, setTitle } = useLike(initialTitle);

    const handleLikeClick = () => {
        toggleLike();
    };

    return (
        <div className='flex'>
            <button 
                onClick={handleLikeClick} 
                disabled={loading}
                className={`hover:bg-blue ${liked
                    ? "bg-blue text-red"
                    : "bg-neutral-200 dark:bg-neutral-700"
                }  px-3 transition-colors duration-300`}
            >
                {liked ? 'Unlike' : 'Like'}
            </button>
            <p>{likeCount}</p>
            {/* {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>} */}
        </div>
    );
};

export default LikeButton;

