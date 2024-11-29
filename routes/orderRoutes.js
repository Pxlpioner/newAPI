var express = require("express");
var router = express.Router();

const orderModel = require("../models/orderModel");

// localhost:3000/order/getAll
router.get("/getAll", async (req, res) => {
  try {
    const mList = await orderModel.find();

    if (mList == null) { return res.status(400).json({ status: false, message: `Bad request - There's no Order` });}

    res.status(200).json(mList);
  } catch (e) { res.status(400).json({ status: false, message: `${e.message}` }); }
});

// localhost:3000/order/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = orderModel.findById(id);

    if (item == null) { return res.status(400).json({ status: false, message: `Bad request - There's no Order` });}

    res.status(200).json(item);
  } catch (e) {
    res.status(400).json({ status: false, message: `${e.message}` }); }
});

// localhost:3000/order/add
router.post("/add", async (req, res) => {
  try {
    const { orderOwner, listProduct, total, status } = req.body;
    const newItem = { orderOwner, listProduct, total, status };

    await orderModel.create(newItem);
    res.status(200).json(newItem);
  } catch (e) {
    res.status(400).json({ status: false, message: `${e.message}` }); }
});

module.exports = router;
