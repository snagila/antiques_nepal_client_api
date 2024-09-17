import wishListSchema from "../schema/wishListSchema.js";

// add product to wishlist
export const addProductToWishlist = (userId, rest) => {
  return wishListSchema({ userId, ...rest }).save();
};

// find the product in the cart
export const findtheWishListProductForUser = (userID, productId) => {
  return wishListSchema.findOne({
    userId: userID,
    productId: productId,
  });
};

// get the user wishlist
export const getProductsOnWishlist = (userId) => {
  return wishListSchema.find({ userId });
};
