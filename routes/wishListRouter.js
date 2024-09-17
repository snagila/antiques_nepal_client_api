import express from "express";
import {
  addProductToWishlist,
  findtheWishListProductForUser,
  getProductsOnWishlist,
} from "../models/wishListModel.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";
import { userAuth } from "../middlewares/auth/userAuth.js";
export const wishListRouter = express.Router();

// add items to cart
wishListRouter.post("/", async (req, res) => {
  try {
    const { product, userID } = req.body;
    // console.log(product);
    const {
      status,
      category,
      description,
      images,
      createdAt,
      updatedAt,
      ...rest
    } = product;

    // check if the product already exists for the user

    const addProduct = await addProductToWishlist(userID, rest);
    if (addProduct) {
      buildSuccessResponse(res, addProduct, "");
    }
  } catch (error) {
    console.log("routererror:", error.message);
    if (error.code === 11000) {
      return buildErrorResponse(res, "Product already exists.");
    }
    buildErrorResponse(res, error.message);
  }
});

// get items from cart
wishListRouter.get("/", userAuth, async (req, res) => {
  try {
    const { _id } = req.userInfo;
    const items = await getProductsOnWishlist(_id);
    if (items) {
      return buildSuccessResponse(res, items, "");
    }
  } catch (error) {
    console.log("routererror:", error.message);
    buildErrorResponse(res, error.message);
  }
});
