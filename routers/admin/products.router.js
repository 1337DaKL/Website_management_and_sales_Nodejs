const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.controller");
const cloud = require("../../middlewares/admin/cloud.middlewares");
var multer = require('multer');
var upload = multer();
router.get("/" , controller.index);
router.patch("/change-status/:status/:id" , controller.changeStatus);
router.patch("/change-multi" , controller.changeMulti);
router.delete("/delete/:id" , controller.deleteProduct);
router.get("/create" , controller.create);
router.post("/create" , upload.single('thumbnail') , cloud.clouldMiddlewares, controller.createNewProduct)
router.get("/edit/:id" , controller.editProduct )
router.patch("/edit/:id" , upload.single('thumbnail') , cloud.clouldMiddlewares , controller.editProductInDatabase)
module.exports = router;