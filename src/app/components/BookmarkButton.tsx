import React, { useState } from 'react';
import { useBookmark } from '../hook/useBookmark'; // Update the path according to your project structure

const LikeButton = ({ initialTitle }: { initialTitle: string }) => {
    const { bookmarked, bookmarkCount, loading, error, toggleBookmark, setTitle } = useBookmark(initialTitle);

    const handleBookmarkClick = () => {
        toggleBookmark();
    };

    return (
        <div className='flex'>
            <button onClick={handleBookmarkClick} disabled={loading}>
                {bookmarked ? 'Unbookmark' : 'Bookmark'}
            </button>
            <p>{bookmarkCount}</p>
            {/* {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>} */}
        </div>
    );
};

export default LikeButton;

