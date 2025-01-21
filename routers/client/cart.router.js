const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");
router.post("/add/:id", controller.addProduct);
router.post("/addFast/:id", controller.addFastProduct);
router.get("/", controller.index);
router.delete("/delete/:id", controller.deleteProductInCart);
router.patch("/change-quantity/:id/:quantity", controller.changeQuantity);
module.exports = router;