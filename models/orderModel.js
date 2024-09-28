import orderSchema from "../schema/orderSchema.js";

// place Order
export const placeOrder = (cartItems, totalPrice, userId, userAddress) => {
  return orderSchema({
    userId,
    orderTotal: totalPrice,
    orderItems: cartItems,
    address: userAddress,
  }).save();
};

// find user orders
export const userOrder = (userId) => {
  return orderSchema.find({ userId });
};
