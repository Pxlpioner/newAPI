const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const product = new Schema({
  _id: { type: ObjectId},
  productName: { type: String },
  productPrice: { type: String }
});

module.exports = mongoose.models.product || mongoose.model("product", product);
