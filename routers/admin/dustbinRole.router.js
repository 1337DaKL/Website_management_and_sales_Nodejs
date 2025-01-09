const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/dustbinRole.controller.js");
const cloud = require("../../middlewares/admin/cloud.middlewares.js")
var multer = require('multer');
var upload = multer();


router.get("/"  , controller.index);
// router.post("/create" ,upload.single('thumbnail') , cloud.clouldMiddlewares, controller.createNewCategory);
router.patch("/restore/:id" , controller.restoreRole);
router.delete("/delete/:id" , controller.deleteRole);
router.patch("/change-multi" , controller.changeMulti);
module.exports = router;