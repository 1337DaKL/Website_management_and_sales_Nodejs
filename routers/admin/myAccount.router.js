const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/myAccount.controller");
const cloud = require("../../middlewares/admin/cloud.middlewares");
var multer = require('multer');
var upload = multer();
router.get("/" , controller.index);
router.get("/edit" , controller.viewEdit);
module.exports = router;