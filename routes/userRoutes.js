var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

const userModel = require("../models/userModel");
const JWT = require('jsonwebtoken');
const tokenConfig = require("../configs/tokenConfig");

router.post("/login", async (req, res) => {
    try {
        const { inputName, inputPass } = req.body;
        const item = await userModel.findOne({ username: inputName, password: inputPass });

        if (!item) { return res.status(404).json({"status": false, "message": 'Username and password are incorrect' }); }

        const token = JWT.sign({ userId: item._id, username: item.username }, tokenConfig.SECRETKEY, { expiresIn: "1h" } );
        const refreshToken = JWT.sign({ username: item.username, userId: item._id }, tokenConfig.SECRETKEY, { expiresIn: '1h'});

        return res.status(200).json({"status": true, "token": token, "refreshToken": refreshToken });

    } catch (e) { return res.status(400).json({ message: e.message }); }
});

router.post('/register', async (req, res) => {
    try {
        const {inputName, inputPass} = req.body;
        const newUser = new userModel({
            _id: new mongoose.Types.ObjectId(),
            username: inputName,
            password: inputPass
          });        
          await userModel.create(newUser);
        res.status(200).json({"status": true, "data": newUser})
    } catch (e) { return res.status(400).json({ message: e.message }); }
});

router.get("/getAll", async (req, res) => {
    try {
      const users = await userModel.find();
      res.status(200).json(users);
    } catch (e) { return res.status(400).json({ message: e.message }); }
});

module.exports = router;