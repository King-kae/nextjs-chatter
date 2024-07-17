import React from 'react';
import GetSinglePost from '../../components/crud/getSinglePost/GetSinglePost'
import { title } from 'process';

export default function PostDetails () {
    return (
        <div>
            <h1>Post Details</h1>
            <GetSinglePost title={title} />
        </div>
    )
}