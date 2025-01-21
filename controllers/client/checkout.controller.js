const Cart = require("../../models/cart.model");
const Product = require("../../models/products.model");
const priceHelper = require("../../helper/chuanHoaGiaHang");
const Order = require("../../models/order.model");
module.exports.index = async (req, res) => {
    const cart = await Cart.findOne(
        {
            _id: req.cookies.cartId
        }
    )
    const product = cart.product;
    let totalCart = 0;
    for (let item of product) {
        const id = item.productId;
        const product = await Product.findOne({
            deleted: false,
            _id: id
        });
        item.product = product;
        if (product.price) {
            const priceNew = (product.price - product.price * product.discount / 100).toFixed(0);
            item.totalPrice = priceNew * item.quantity;
            totalCart += item.totalPrice;
            if (item.totalPrice) {
                item.totalPriceString = priceHelper(item.totalPrice);
            }

            item.priceString = priceHelper(priceNew);
        }

    }
    const totalCartString = priceHelper(totalCart);
    res.render("client/pages/checkout/index.pug", {
        titlePage: "Đặt hàng",
        product: product,
        totalCart: totalCartString
    })
}
module.exports.order = async (req, res) => {
    try {
        if (!req.body.fullName) {
            req.flash("error", "Tên không được bỏ trống");
            res.redirect("back");
            return;
        }
        if (!req.body.email) {
            req.flash("error", "Email không được bỏ trống");
            res.redirect("back");
            return;
        }
        if (!req.body.telephone) {
            req.flash("error", "Số điẹn thoại không được bỏ trống");
            res.redirect("back");
            return;
        }
        if (!req.body.address) {
            req.flash("error", "Địa chỉ không được bỏ trống");
            res.redirect("back");
            return;
        }
        const cartId = req.cookies.cartId;
        const userInfor = {
            fullName: req.body.fullName,
            email: req.body.email,
            telephone: req.body.telephone,
            address: req.body.address
        }
        let products = [];
        const cart = await Cart.findOne(
            {
                _id: cartId
            }
        )
        for (let item of cart.product) {
            const productInCart = {
                product_id: item.productId,
                quantity: item.quantity
            };
            const product = await Product.findOne({
                _id: item.productId
            })
            if (product.price) {
                productInCart.price = product.price;

            }
            if (product.discount) {
                productInCart.discount = product.discount
            }
            products.push(productInCart);

        }
        const order = {
            cart_id: cartId,
            userInfor: userInfor,
            products: products
        }
        const orderProducts = new Order(order);
        await orderProducts.save();
        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                product: []
            }
        )
        res.redirect(`/checkout/success/${orderProducts.id}`);
    } catch (error) {
        req.flash("error", "Đặt hàng không thành công!!");
        res.redirect("back");
    }
}