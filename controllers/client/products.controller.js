const Product = require("../../models/products.model");
const priceString = require("../../helper/chuanHoaGiaHang");
module.exports.index = async (req , res ) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    });

    const newProducts = products.map((test) => {
        test.newPrice = priceString((test.price - test.price * test.discount / 100).toFixed(0));
        test.priceString = priceString(test.price);
        return test;
    });
    res.render("client/page/products/index.pug" , {
        titlePage : "Trang danh sach san pham",
        products : newProducts
    });
}