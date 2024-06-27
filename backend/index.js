import connectToMongo from "./database/db.js";
import express from "express";
import cors from "cors";
import { connect } from "mongoose";
import payment from "./routes/paymentRoute.js";

connectToMongo();
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Ramaaaa");
});

app.use("/api/payment", payment);
app.listen(port, () => {
  console.log(`app listening at port ${port}`);
});
