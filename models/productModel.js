import productSchema from "../schema/productSchema.js";

// GET ALL PRODUCTS
export const getProducts = () => {
  return productSchema.find({});
};
