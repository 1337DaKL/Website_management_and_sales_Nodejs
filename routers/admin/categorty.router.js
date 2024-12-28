const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/category.controller.js");
const cloud = require("../../middlewares/admin/cloud.middlewares.js")
var multer = require('multer');
var upload = multer();
router.get("/"  , controller.index);
router.get("/create" , controller.createCategory);
router.post("/create" ,upload.single('thumbnail') , cloud.clouldMiddlewares, controller.createNewCategory);
router.patch("/change-status/:status/:id" , controller.changeStatus);
router.patch("/change-multi" , controller.changeMulti);
module.exports = router;