const Cart = require("../../models/cart.model");
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