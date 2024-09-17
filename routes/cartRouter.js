import express from "express";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";
import {
  addProductToCart,
  deleteCartItems,
  findProductInUserCart,
  getProductsOnCart,
  updateProductQuantity,
} from "../models/cartModel.js";
import { userAuth } from "../middlewares/auth/userAuth.js";

export const cartRouter = express.Router();

// add items to cart
cartRouter.post("/", async (req, res) => {
  try {
    const { userID, cartItem } = req.body;

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

// edit items quantity on cart
cartRouter.patch("/editcart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { productQuantity, itemPrice } = req.body;
    const updatedProductQuantity = await updateProductQuantity(
      id,
      productQuantity,
      itemPrice
    );
    if (updatedProductQuantity) {
      return buildSuccessResponse(res, updatedProductQuantity, "");
    }
  } catch (error) {
    console.log(error.message);
    buildErrorResponse(res, error.message);
  }
});

// delete cart items
cartRouter.delete("/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;

    const result = await deleteCartItems(cartId);
    if (result.acknowledged === true) {
      return buildSuccessResponse(res, "", "");
    }
    buildErrorResponse(res, error.message);
  } catch (error) {
    console.log(error.message);
    buildErrorResponse(res, error.message);
  }
});
