import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      index: 1,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("session", sessionSchema);
