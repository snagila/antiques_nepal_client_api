import mongoose from "mongoose";

// Define the schema for each item in the cart
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },

  thumbnail: [
    {
      type: String,
    },
  ],
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [cartItemSchema],
});

export default mongoose.model("cart", cartSchema);
