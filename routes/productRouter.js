import express from "express";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";
import { getProducts } from "../models/productModel.js";

export const productRouter = express.Router();

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
