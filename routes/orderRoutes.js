const express = require("express");
const router = express.Router();
const orderModel = require("../models/orderModel"); // Model for Order
const productModel = require("../models/productModel"); // Model for Product
const JWT = require("jsonwebtoken");
const tokenConfig = require("../configs/tokenConfig");
const { default: mongoose } = require("mongoose");

router.get("/getAll", async (req, res) => {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (!token) { return res.status(401).json({ "message": 401 }); }

    JWT.verify(token, tokenConfig.SECRETKEY, async (err, id) => {
      if (err) { return res.status(403).json({ "message": `403 - false`, "err": err }); }

      const mList = await orderModel.find();

      if (mList == null) { return res.status(400).json({ status: false, message: `Bad request - There's no Order` }); }

      res.status(200).json(mList);
    });
  } catch (e) { res.status(400).json({ status: false, message: `${e.message}` }); }
});

router.get("/:id", async (req, res) => {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (!token){ return res.status(400).json({"status": "Failed", "message": "Bad request!"}); }

    const { id } = req.params;
    const item = orderModel.findById(id);

    if (item == null) { return res.status(400).json({ status: false, message: `Bad request - There's no Order` }); }

    res.status(200).json(item);
  } catch (e) { res.status(400).json({ status: false, message: `${e.message}` }); }
});

router.post("/orders", async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];

    if (!token) {return res.status(401).json({ message: "Unauthorized: Token required" }); }

    let userId;
    JWT.verify(token, tokenConfig.SECRETKEY, (err, decoded) => {
      if (err) { return res.status(403).json({ message: "Forbidden: Invalid token", error: err }); }
      userId = decoded.userId;
    });

    const { listProduct } = req.body;

    if (!Array.isArray(listProduct) || listProduct.length === 0) {
      return res.status(400).json({ message: "listProduct must be a non-empty array" });
    }

    let total = 0;
    for (const item of listProduct) {
      const product = await productModel.findById(item.productId);
      if (!product) { return res.status(404).json({ message: `Product with ID ${item.productId} not found` }); }

      const price = parseFloat(product.productPrice);
      const quantity = item.quantity;

      if (isNaN(price) || isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Invalid product price or quantity" });
      }

      total += price * quantity;
    }
    
    if (!userId) {
      return res.status(400).json({ message: "Invalid user. UserId not found in token." });
    }
    

    const newOrder = new orderModel({
      _id: new mongoose.Types.ObjectId(),
      orderOwner: userId,
      listProduct,
      total,
      status: false,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
});

module.exports = router;
