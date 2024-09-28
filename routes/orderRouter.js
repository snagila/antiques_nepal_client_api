import express from "express";
import {
  deleteCartItems,
  updateProductAvaibaleQuantity,
} from "../models/cartModel.js";
import { placeOrder, userOrder } from "../models/orderModel.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";

export const orderRouter = express.Router();

// place order
orderRouter.post("/order", async (req, res) => {
  try {
    const { cartItems, totalPrice, userId, userAddress } = req.body;

    const reduceProductAvailabeQuantity = cartItems?.map((item) =>
      updateProductAvaibaleQuantity(item.sku, item.quantity)
    );
    await Promise.all(reduceProductAvailabeQuantity);

    if (reduceProductAvailabeQuantity) {
      const sendOrder = placeOrder(cartItems, totalPrice, userId, userAddress);
      const deleterecentCartItems = cartItems?.map((item) =>
        deleteCartItems(item._id)
      );
      const result = await Promise.all([sendOrder, ...deleterecentCartItems]);

      if (result) {
        return buildSuccessResponse(
          res,
          sendOrder,
          "Your Order has been successfully placed."
        );
      }
    }
  } catch (error) {
    console.log(error.message);
    buildErrorResponse(res, error.message);
  }
});

// get placed order for the user
orderRouter.get("/userorder/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const findUserOrders = await userOrder(id);
    if (findUserOrders) {
      buildSuccessResponse(res, findUserOrders, "User Orders.");
    }
  } catch (error) {
    console.log("router error:", error.message);
    buildErrorResponse(res, error.message);
  }
});
