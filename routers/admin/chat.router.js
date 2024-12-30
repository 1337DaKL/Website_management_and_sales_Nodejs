const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/chat.controller.js");
router.get("/" , controller.index);
router.get("/detel/:id" , controller.viewMess);
module.exports = router;