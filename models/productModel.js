import productSchema from "../schema/productSchema.js";

// GET ALL PRODUCTS
export const getProducts = () => {
  return productSchema.find({});
};

// get a product
export const getAProduct = (productSKU) => {
  return productSchema.findOne({ sku: productSKU });
};

// find a product
export const findAProduct = (productSKU) => {
  return productSchema.findOne({ sku: productSKU });
};
