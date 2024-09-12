import express from "express";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";
import {
  addProductToCart,
  findProductInUserCart,
  getProductsOnCart,
  updateProductOnCart,
} from "../models/cartModel.js";
import { userAuth } from "../middlewares/auth/userAuth.js";

export const cartRouter = express.Router();

// add items to cart
cartRouter.post("/", async (req, res) => {
  try {
    const { userID, cartItem } = req.body;
    const { productId, quantity, price, total } = cartItem;
    // console.log(cartItem);
    // find if product already exists so you can increase its totaling
    const findProductOnCart = await findProductInUserCart(userID, productId);
    if (findProductOnCart) {
      const updatedProduct = await updateProductOnCart(
        userID,
        productId,
        quantity,
        Number(price),
        total
      );

      return buildSuccessResponse(res, updatedProduct, "");
    }

    const addProduct = await addProductToCart(userID, cartItem);
    if (addProduct) {
      buildSuccessResponse(res, addProduct, "");
    }
  } catch (error) {
    console.log("routererror:", error.message);
    buildErrorResponse(res, error.message);
  }
});

// get items from cart
cartRouter.get("/", userAuth, async (req, res) => {
  try {
    const { _id } = req.userInfo;
    const items = await getProductsOnCart(_id);
    if (items) {
      return buildSuccessResponse(res, items, "");
    }
  } catch (error) {
    console.log("routererror:", error.message);
    buildErrorResponse(res, error.message);
  }
});
