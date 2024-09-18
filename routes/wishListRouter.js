import express from "express";
import {
  addProductToCart,
  addProductToWishlist,
  checkWishlistIteminCart,
  deleteProductFromWishlist,
  findtheWishListProductForUser,
  getProductsOnWishlist,
} from "../models/wishListModel.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";
import { userAuth } from "../middlewares/auth/userAuth.js";
import { findAProduct } from "../models/productModel.js";
export const wishListRouter = express.Router();

// add wishlist items to cart
wishListRouter.post("/", async (req, res) => {
  try {
    const { wishListItem, userID } = req.body;

    const addProduct = await addProductToWishlist(userID, wishListItem);
    if (addProduct) {
      buildSuccessResponse(res, addProduct, "");
    }
  } catch (error) {
    console.log("routererror:", error.message);
    if (error.code === 11000) {
      return buildErrorResponse(
        res,
        "Product already exists in your Wishlist."
      );
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

// add wishlist items to cart
wishListRouter.post("/:id", async (req, res) => {
  try {
    const item = req.body;

    // if if the product already exists in the cart
    const itemInCart = await checkWishlistIteminCart(item.userId, item.sku);

    if (itemInCart?._id) {
      const deleteProduct = await deleteProductFromWishlist(item.sku);
      return buildSuccessResponse(res, "", `${item.name} added to cart.`);
    }
    if (!itemInCart?._id) {
      const [addProduct, deleteProduct] = await Promise.all([
        addProductToCart(item),
        deleteProductFromWishlist(item.sku),
      ]);

      if (addProduct._id && deleteProduct.deletedCount === 1) {
        return buildSuccessResponse(res, "", `${item.name} added to cart.`);
      }
    }
  } catch (error) {
    console.log("router error", error.message);
    buildErrorResponse(res, error.message);
  }
});

// delete items from wishList
wishListRouter.delete("/:sku", async (req, res) => {
  try {
    const { sku } = req.params;
    const deleteWishListItem = await deleteProductFromWishlist(sku);
    if (deleteWishListItem.deletedCount === 1) {
      buildSuccessResponse(res, "", "");
    }
  } catch (error) {
    console.log(error.message);
    buildErrorResponse(res, error.message);
  }
});
