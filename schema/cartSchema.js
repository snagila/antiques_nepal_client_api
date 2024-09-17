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
  totalPrice: {
    type: Number, // Store the calculated total price
  },
  sku: {
    type: String,
  },
  availableQuantity: { type: Number },
  thumbnail: [
    {
      type: String,
    },
  ],
});

cartSchema.pre("save", function (next) {
  this.totalPrice = this.quantity * this.price;
  next();
});

export default mongoose.model("cart", cartSchema);
