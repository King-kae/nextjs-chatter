import { Schema, model, models } from "mongoose";

const comment = Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        text: String,
        like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
)

const file = Schema(
    {
        type: String,
        path: String,
    },
    { _id: false }
)

const postSchema = Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        content: {
            type: String,
            required: true,
        },
        files: [file],
        comments: [comment],
        usersSaved: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        usersLiked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
)

const Post = models.Post || model('Post', postSchema)

export default Post;