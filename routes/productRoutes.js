var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');

const productModel = require("../models/productModel");
const JWT = require('jsonwebtoken');
const tokenConfig = require("../configs/tokenConfig");

router.post("/getAll", async (req, res) => {
    try {
        const token = req.header("Authorization").split(' ')[1];

        if ( !token ) { return res.status(401).json({ "message": 401 }); }
            
        JWT.verify(token, tokenConfig.SECRETKEY, async (err, id) => {
            if (err) { return res.status(403).json({ "message": `403 - false`, "err": err }); }

            const mlist = await productModel.find();
            res.status(200).json(mlist); 
        });

    } catch (e) { res.status(400).json({ message: `Something went wrong - ${e.message}` }); }
});

router.get('/getByid/:id', async (req, res) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (!token){ return res.status(401).json({message: "401 - Bad Request" }); }

        JWT.verify(token, tokenConfig.SECRETKEY, async (err, id) => {
            if (err) { return res.status(401).json({"status": 403, "error": err}); }
            const pId = req.params;
            const item = await productModel.findById(pId);
            res.status(200).json(item);
        })
    } catch (e) { res.status(400).json({ message: `Something went wrong - ${e.message}` }); }
});

router.put('/updateByid/', async (req, res) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (!token){ return res.status(401).json({message: "401 - Bad Request" }); }

        const {id, name, price } = req.query;
        const updateItem = productModel.findById(id);
        if (updateItem == null) { return res.status(401).json({"status": 403}); }

        updateItem.productName = name ? name : updateItem.productName;
        updateItem.productPrice = price ? price : updateItem.v;
        await productModel.save(updateItem);
        
        res.status(200).json({"updateItem": updateItem});

    } catch (e) { res.status(400).json({ message: `Something went wrong - ${e.message}` }); }
});

router.post("/addProduct", async (req, res) => {
    try {
        const token = req.header("Authorization").split(' ')[1];

        if (!token) { return res.status(401).json({ "message": 401 }); }

        JWT.verify(token, tokenConfig.SECRETKEY, async (err) => {
            if (err) { return res.status(403).json({ "message": "403 - Unauthorized", "err": err }); }

            const { name, price } = req.body;

            if (!name || !price) {
                return res.status(400).json({ message: "Name and price are required fields." });
            }

            const newProduct = new productModel({
                    _id: new mongoose.Types.ObjectId(),
                    productName: name,
                    productPrice: price
                });
            const savedProduct = await newProduct.save();

            res.status(201).json({ message: "Product created successfully", product: savedProduct });
        });
    } catch (e) { res.status(400).json({ message: `Something went wrong - ${e.message}` }); }
});


module.exports = router;
