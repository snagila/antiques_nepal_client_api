import cartSchema from "../schema/cartSchema.js";

// add product to the user cart
export const addProductToCart = (userId, cartItem) => {
  return cartSchema({ userId, items: [{ ...cartItem }] }).save();
};

// get the user product card
export const getProductsOnCart = (userId) => {
  return cartSchema.find({ userId });
};

// find the product in the cart
export const findProductInUserCart = (userID, productId) => {
  return cartSchema.findOne({ userId: userID, "items.productId": productId });
};

// update the single product in the cart this is the inc operator one
export const updateProductOnCart = (
  userID,
  productId,
  quantity,
  price,
  total
) => {
  return cartSchema.updateOne(
    { userId: userID, "items.productId": productId },
    {
      $inc: {
        "items.$.quantity": quantity,
        // "items.$.price": price,
        "items.$.total": price,
      },
    },
    { new: true }
  );
};

// update product quantity on cart
export const updateProductQuantity = (
  cartId,
  productIdOnCart,
  productQuantity
) => {
  return cartSchema.findOneAndUpdate(
    {
      _id: cartId,
      "items._id": productIdOnCart,
    },
    { $set: { "items.$.quantity": productQuantity } },
    { new: true }
  );
};
