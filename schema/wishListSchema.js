import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },

    price: {
      type: Number,
      required: true,
    },
    salesPrice: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
    },
    salesStartDate: {
      type: Date,
    },
    salesEndDate: {
      type: Date,
    },
    sku: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },

    thumbnail: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("wishList", wishListSchema);
