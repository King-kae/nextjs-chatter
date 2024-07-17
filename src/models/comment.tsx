import { Schema, model, models } from "mongoose";

//model - based on schema - each instance is a new document
const commentSchema = new Schema({
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
  parentPost: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
  parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  likes: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
});

const Comment = models.Comment || model("Comment", commentSchema);

module.exports = Comment //returns a constructor function