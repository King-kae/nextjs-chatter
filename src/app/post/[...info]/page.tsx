import React from 'react';

export default function UserDetails({params}: {params: {info: string[]}}) {
    const {info} = params;

    const [username, slug] = info;

    return (
        <div>
            <h1>User: {username}</h1>
            <p>slug: /{slug}</p>
        </div>
    );
}