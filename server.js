import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectToMongoDb } from "./config/dbConfig.js";
import { categoryRouter } from "./routes/categoryRouter.js";
import { productRouter } from "./routes/productRouter.js";
import { userRouter } from "./routes/userRouter.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);

// Connect to Database
connectToMongoDb();

// Run the server
app.listen(PORT, (error) => {
  error
    ? console.log("Error", error)
    : console.log("Server is running at port", PORT);
});
