import express from "express";
import dotenv from "dotenv";
import createHttpError from "http-errors";
import AuthRouter from "./Router/Auth.route.js";
import cors from "cors";
import connectDB from "./Config/db.config.js";
import { verifyAccessToken } from "./helper/jwtToken.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

//CORS POLICY
app.use(cors());

//DATABASE CONNECTION
connectDB(DATABASE_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//AUTH ROUTES
app.use("/auth", AuthRouter);

//PROTECTED ROUTES
app.use(verifyAccessToken);
app.get("/", (req, resp, next) => {
  console.log(req.payload);
});

//NOT FOUND ROUTES
app.use((req, resp, next) => {
  next(createHttpError.NotFound());
});

//ERROR HANDLER
app.use((err, req, resp, next) => {
  resp.status(err.status || 500);
  // console.log(err)
  resp.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
