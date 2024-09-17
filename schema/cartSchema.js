import mongoose from "mongoose";

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
    default: 1,
  },
  totalPrice: {
    type: Number,
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
