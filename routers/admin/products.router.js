const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.controller");
const storageHelper = require("../../helper/storage ");
var multer = require('multer');
var upload = multer({ storage: storageHelper() });

router.get("/" , controller.index);
router.patch("/change-status/:status/:id" , controller.changeStatus);
router.patch("/change-multi" , controller.changeMulti);
router.delete("/delete/:id" , controller.deleteProduct);
router.get("/create" , controller.create);
router.post("/create" , upload.single('thumbnail') , controller.createNewProduct)
router.get("/edit/:id" , controller.editProduct )
router.patch("/edit/:id" , upload.single('thumbnail') , controller.editProductInDatabase)
module.exports = router;