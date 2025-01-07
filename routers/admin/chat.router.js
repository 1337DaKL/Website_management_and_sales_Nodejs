const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/chat.controller.js");
router.get("/" , controller.index);
router.get("/detel/:id" , controller.viewMess);
router.get("/delete/:id" , controller.deleteMess);
router.post("/reply/:id" , controller.replyMess);
router.get("/delete-multi" , controller.deleteMulti);
module.exports = router;