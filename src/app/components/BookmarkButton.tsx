import React, { useState } from 'react';
import { useBookmark } from '../hook/useBookmark'; // Update the path according to your project structure

const LikeButton = ({ initialTitle }: { initialTitle: string }) => {
    const { bookmarked, loading, error, toggleBookmark, setTitle } = useBookmark(initialTitle);

    const handleBookmarkClick = () => {
        toggleBookmark();
    };

    return (
        <div>
            <button onClick={handleBookmarkClick} disabled={loading}>
                {bookmarked ? 'Unbookmark' : 'Bookmark'}
            </button>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default LikeButton;

