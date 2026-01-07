"use strict";

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routes/routes");

// init express
const app = express();

// bring in .env stuff
dotenv.config({ path: "../.env" });

// define port
const PORT = process.env.PORT || 8080;

// basic middleware stack
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // exact frontend URL
    credentials: true,
  })
);

// connect to db thru mongoose
mongoose
  .connect(process.env.MONGO_CONN_STRING)
  .then(() => console.log("✅ db conn success"))
  .catch(() => console.log("❌ db conn failed"));

// use router (routes)
app.use("/", router);

// init server, start listening
app.listen(PORT, () => {
  console.log(`✅ server active, port ${PORT}... 👂`);
});
