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
    const cartId = req.cookies.cartId;
    const cartHeader = await Cart.findOne({
        _id: cartId
    });
    let countProductInCart = 0;
    if (cartHeader) {
        countProductInCart = cartHeader.product.reduce((cnt, tmp) => {
            return tmp.quantity + cnt;
        }, 0);
    }

    res.locals.countProductInCart = countProductInCart;
    next();
}