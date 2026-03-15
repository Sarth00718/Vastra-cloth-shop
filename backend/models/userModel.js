import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  cartData: {
    type: Object,
    default: {}
  },
  wishlist: {
    type: [String],
    default: []
  }

}, { timestamps: true, minimize: false });

export const User = mongoose.model("User", userSchema);