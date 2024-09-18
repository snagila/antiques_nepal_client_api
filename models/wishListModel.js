import cartSchema from "../schema/cartSchema.js";
import wishListSchema from "../schema/wishListSchema.js";

// add product to wishlist
export const addProductToWishlist = (userId, rest) => {
  return wishListSchema({ userId, ...rest }).save();
};

// get the user wishlist
export const getProductsOnWishlist = (userId) => {
  return wishListSchema.find({ userId });
};

// check if the wishlist item is in the cart
export const checkWishlistIteminCart = (userId, sku) => {
  return cartSchema.findOne({ userId, sku });
};

// find the product in the cart
export const findtheWishListProductForUser = (userID, sku) => {
  return wishListSchema.findOne({
    userId: userID,
    sku: sku,
  });
};

// delete product from wishlist
export const deleteProductFromWishlist = (sku) => {
  return wishListSchema.deleteOne({ sku });
};

// addWishList product to cart
// add product to the user cart
export const addProductToCart = (item) => {
  return cartSchema(item).save();
};
