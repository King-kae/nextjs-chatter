import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  avatar: {
    type: String,
    default: "",
  },
  username: { 
    type: String, 
    trim: true
  },
  password: { 
    type: String, 
    trim: true 
  },
  email: { 
    type: String, 
    trim: true, 
    unique: true, 
    required: true 
  },
  infos: {
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    liked: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    saved: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    subs: [{ type: Schema.Types.ObjectId, ref: "User" }],
    mySubs: [{ type: Schema.Types.ObjectId, ref: "User" }],
  }
}, {timestamps: true});

const User = models.User || model("User", userSchema);
export default User;