import cartSchema from "../schema/cartSchema.js";

// add product to the user cart
export const addProductToCart = (userId, cartItem) => {
  return cartSchema({ userId, ...cartItem }).save();
};

// increase product Quantity
export const increaseProductQuantity = (cartID, quantity, price) => {
  return cartSchema.findOneAndUpdate(
    { _id: cartID },
    { $inc: { quantity: quantity, totalPrice: price * quantity } }
  );
};

// get the user product card
export const getProductsOnCart = (userId) => {
  return cartSchema.find({ userId });
};

// find the product in the cart
export const findtheProductForUser = (userID, productId) => {
  return cartSchema.findOne({
    userId: userID,
    productId: productId,
  });
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
