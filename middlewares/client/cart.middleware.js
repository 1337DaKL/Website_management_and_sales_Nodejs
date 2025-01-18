const Cart = require("../../models/cart.model");
module.exports.createCart = async (req, res, next) => {
    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();
        const timeCookie = 1000 * 60 * 60 * 24 * 365 // Lưu trong 1 năm
        res.cookie("cartId", cart.id, { expires: new Date(Date.now() + timeCookie) });
    }
    else {
        console.log("Đã có giỏ hàng!!");
    }
    next();
}