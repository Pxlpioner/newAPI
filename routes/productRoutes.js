var express = require("express");
var router = express.Router();

const productModel = require("../models/productModel");
const JWT = require('jsonwebtoken');
const tokenConfig = require("../configs/tokenConfig");

router.post("/getAll", async (req, res) => {
    try {
        const token = req.header("Authorization").split(' ')[1];

        if ( !token ) { return res.status(401).json({ "status": 401 }); }
            
        JWT.verify(token, tokenConfig.SECRETKEY, async (err, id) => {
            if (err) { return res.status(403).json({ "status": `403 - false`, "err": err }); }

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
        const {id} = req.query;
        const updateItem = productModel.findById(id);
        if (!updateItem) { return res.status(401).json({"status": 403}); }
        
        await productModel.save(updateItem);
        res.status(200).json({"updateItem": updateItem});

    } catch (e) { res.status(400).json({ message: `Something went wrong - ${e.message}` }); }
});
module.exports = router;