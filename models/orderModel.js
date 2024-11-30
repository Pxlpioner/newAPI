const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// Order Schema
const order = new Schema({
  _id: { type: ObjectId},
  orderOwner: { type: ObjectId, required: true, ref: 'user' },
  listProduct: [
    {
      productId: { type: ObjectId, ref: 'product' },
      quantity: { type: Number, min: 1 }
    }
  ],
  total: { type: Number, min: 0},
  status: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.order || mongoose.model("order", order);
