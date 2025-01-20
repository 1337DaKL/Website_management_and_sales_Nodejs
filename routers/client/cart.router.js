const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");
router.post("/add/:id" , controller.addProduct);
router.post("/addFast/:id" , controller.addFastProduct);
module.exports = router;