// route cua trang san pham


//nhung express vao vi ham Router() de tao cac route con trong express;
const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/products.controller.js");

router.get("/" , controller.index);
router.get("/:slug" , controller.viewProductSlug);
router.get("/detel/:slug" , controller.viewDetel)
module.exports = router;