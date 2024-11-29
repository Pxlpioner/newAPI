var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
require("./models/orderModel");
require("./models/userModel");
require("./models/productModel");

var orderRouter = require("./routes/orderRoutes");
var userRoutes = require("./routes/userRoutes");
var productRoutes = require("./routes/productRoutes.js");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose
  .connect("mongodb+srv://toibietemkhongbiet:qkQFqczxEJAdn7a@cluster0.zpgih.mongodb.net/asm")
  .then( ( ) => {console.log(">>> DB CONNECTED!!!!!!!!");})
  .catch((e) => {console.log(`>>> DB Error: ${e.message}`);});

app.use("/orders", orderRouter);
app.use("/users", userRoutes);
app.use("/products", productRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
