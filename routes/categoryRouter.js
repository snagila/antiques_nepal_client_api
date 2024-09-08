import express from "express";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";
import { getCategories } from "../models/categoryModel.js";

export const categoryRouter = express.Router();

categoryRouter.get("/", async (req, res) => {
  try {
    const allCategories = await getCategories();
    if (allCategories) {
      buildSuccessResponse(res, allCategories, "All Categories");
    }
  } catch (error) {
    console.log(error.message);
    return buildErrorResponse(res, error.message);
  }
});
