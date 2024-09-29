const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/dustbin.controller");

router.get("/" , controller.index);
router.patch("/restore/:id" , controller.restoreProduct);
router.delete("/delete/:id" , controller.deleteProduct);
router.patch("/change-multi" , controller.changeMulti)
module.exports = router;