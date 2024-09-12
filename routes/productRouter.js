import express from "express";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";
import { getAProduct, getProducts } from "../models/productModel.js";

export const productRouter = express.Router();

// get all products
productRouter.get("/", async (req, res) => {
  try {
    const products = await getProducts();
    if (products) {
      buildSuccessResponse(res, products, "All Products");
    }
  } catch (error) {
    console.log("router error:", error.message);
    return buildErrorResponse(res, error.message);
  }
});

// get a single product
productRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getAProduct(id);
    if (product?._id) {
      return buildSuccessResponse(res, product, "");
    }
  } catch (error) {
    console.log("router error:", error.message);
    buildErrorResponse(res, error.message);
  }
});
