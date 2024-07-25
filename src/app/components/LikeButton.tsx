import React, { useState } from 'react';
import { useLike } from '../hook/useLike'; // Update the path according to your project structure

const LikeButton = ({ initialTitle }: { initialTitle: string }) => {
    const { liked, likeCount, loading, error, toggleLike, setTitle } = useLike(initialTitle);

    const handleLikeClick = () => {
        toggleLike();
    };

    return (
        <div>
            <button onClick={handleLikeClick} disabled={loading}>
                {liked ? 'Unlike' : 'Like'}
            </button>
            <p>Likes: {likeCount}</p>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default LikeButton;

