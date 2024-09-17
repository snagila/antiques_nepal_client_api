import cartSchema from "../schema/cartSchema.js";

// add product to the user cart
export const addProductToCart = (userId, cartItem) => {
  return cartSchema({ userId, ...cartItem }).save();
};

// get the user product card
export const getProductsOnCart = (userId) => {
  return cartSchema.find({ userId });
};

// find the product in the cart
export const findProductInUserCart = (userID, productId) => {
  return cartSchema.findOne({ userId: userID, "items.productId": productId });
};

// update product quantity on cart
export const updateProductQuantity = (cartId, productQuantity, itemPrice) => {
  return cartSchema.updateOne(
    { _id: cartId },
    {
      $set: {
        quantity: productQuantity,
        totalPrice: productQuantity * itemPrice,
      },
    },
    { new: true }
  );
};

// delete cart items
export const deleteCartItems = (cartId) => {
  return cartSchema.deleteOne({ _id: cartId });
};
