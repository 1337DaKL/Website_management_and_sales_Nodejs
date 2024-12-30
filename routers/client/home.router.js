const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/home.controller");

router.get("/" , controller.index);
router.post("/contact" , controller.contact);
router.get("/contact" , controller.viewContact);

module.exports = router;