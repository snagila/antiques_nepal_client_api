import categorySchema from "../schema/categorySchema.js";

export const getCategories = () => {
  return categorySchema.find({});
};
