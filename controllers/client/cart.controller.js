const Cart = require("../../models/cart.model");
const Product = require("../../models/products.model");
const priceHelper = require("../../helper/chuanHoaGiaHang");
module.exports.addProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const quantity = req.body.quantity;
        const cartId = req.cookies.cartId;
        const cart = await Cart.findOne({ _id: cartId });
        const exitsProductInCart = cart.product.find(item => item.productId == productId);
        console.log(exitsProductInCart)
        if (exitsProductInCart) {
            const newQuantity = parseInt(quantity) + parseInt(exitsProductInCart.quantity);
            await Cart.updateOne(
                {
                    'product.productId': productId
                },
                {
                    '$set': {
                        'product.$.quantity': newQuantity
                    }
                }
            )
        }
        else {
            const product = {
                productId: req.params.id,
                quantity: req.body.quantity
            }

            await Cart.updateOne(
                { _id: cartId },
                {
                    $push: {
                        product: product
                    }
                }
            )
        }

        req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công!!");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Thêm sản phẩm vào giỏ hàng không thành công!!");
        res.redirect("back");
    }
}
module.exports.addFastProduct = async (req, res) => {
    try {
        const idProduct = req.params.id;
        const idCart = req.cookies.cartId;
        const cart = await Cart.findOne({ _id: idCart });
        const exitsProductInCart = cart.product.find(tmp => tmp.productId == idProduct);
        if (exitsProductInCart) {
            const newQuantity = exitsProductInCart.quantity + 1;
            await Cart.updateOne(
                {
                    'product.productId': idProduct
                },
                {
                    '$set': {
                        'product.$.quantity': newQuantity
                    }
                }
            )
        }
        else {
            await Cart.updateOne(
                { _id: idCart },
                {
                    $push: {
                        product: {
                            productId: idProduct,
                            quantity: 1
                        }
                    }
                }
            )
        }
        req.flash("success", "Thêm nhanh sản phẩm vào trong giỏ hành thành công!");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Thêm nhanh sản phẩm vào giỏ hàng thất bại");
        res.redirect("back");
    }
}

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
    res.render("client/pages/cart/index.pug", {
        titlePage: "Giỏ hàng",
        product: product,
        totalCart: totalCartString
    })
}

module.exports.deleteProductInCart = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const productId = req.params.id;
        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                "$pull": {
                    product: {
                        "productId": productId
                    }
                }
            }
        )
        req.flash("success", "Xóa sản phẩm ra giỏ hàng thành công");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Xóa sản phẩm ra giỏ hàng không thành công");
        res.redirect("back");
    }
}
module.exports.changeQuantity = async (req, res) => {
    try {
        const id = req.params.id;
        const quantity = parseInt(req.params.quantity);
        if (quantity <= 0) {
            req.flash("error", "Xin lỗi!! Phải có ít nhất 1 sản phẩm !!");
            res.redirect("back");
            return;
        }
        const product = await Product.findOne(
            {
                _id: id
            }
        )
        if (quantity > product.stock) {
            req.flash("error", `Xin lỗi trong kho chỉ còn ${product.stock} sản phẩm`);
            res.redirect("back");
            return;
        }
        await Cart.updateMany(
            {
                "product.productId": id
            },
            {
                '$set': {
                    'product.$.quantity': quantity
                }
            }
        )
        req.flash("success", "Đổi số lượng sản phẩm thành công");
        res.redirect("back");
    } catch (error) {

    }
}