import React from 'react';
import useCurrentUser from '../../hook/useCurrentUser';
import axios from 'axios';
import useLike from '../../hook/useLike';


const PreviewReactions = ({likes}: any) => {
const { data: currentUser } = useCurrentUser()
const hasLiked = false;

const {liked, loading, handleLike} = useLike({params: {title: likes}}, hasLiked);

return (
    <div>
        <button onClick={handleLike}>
            {liked ? 'Unlike' : 'Like'}
        </button>
    </div>
);

}


export default PreviewReactions;