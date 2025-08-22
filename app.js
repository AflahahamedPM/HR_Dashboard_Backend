const express = require("express");
const path = require("path");
var multer = require("multer");
var cookieParser = require("cookie-parser");
var cors = require("cors");
const { default: connectDB } = require("./config/connect");
require("dotenv").config();
var app = express();
const admin = require("./routes/admin");

connectDB();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "https://hr-dashboard-frontend-4ewj.vercel.app"
    ],
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);
// app.use(multer());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "build")));
app.use("/app", express.static(path.join(__dirname, "build")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/admin", admin);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});
module.exports = app;
