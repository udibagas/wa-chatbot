require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const app = express();
const xhub = require("express-x-hub");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// SPA
app.use(express.static("client-app/dist"));

const origin = process.env.CLIENT_URL?.split(",") ?? [];
app.use(cors({ origin, credentials: true }));
app.use(logger("dev"));
app.use(xhub({ algorithm: "sha1", secret: process.env.APP_SECRET }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/media", express.static(path.join(__dirname, "media")));

app.use(require("./routes/index"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(require("./middlewares/errorHandler.middleware"));

module.exports = app;
