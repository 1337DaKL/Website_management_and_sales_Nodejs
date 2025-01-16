const Product = require("../../models/products.model");
const priceString = require("../../helper/chuanHoaGiaHang");
const Category = require("../../models/category.model");
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    });

    const newProducts = products.map((test) => {
        test.newPrice = priceString((test.price - test.price * test.discount / 100).toFixed(0));
        test.priceString = priceString(test.price);
        return test;
    });
    res.render("client/pages/products/index.pug", {
        titlePage: "Trang danh sach san pham",
        products: newProducts
    });
}
module.exports.viewProductSlug = async (req, res) => {
    const slug = req.params.slug;
    const categoryProduct = await Category.findOne({
        slug: slug,
        deleted: false,
        status: "active"
    })
    const getChildCategory = async (idParentCategory) => {
        const childsCategory = await Category.find(
            {
                deleted: false,
                idParent: idParentCategory,
                status: "active"
            }
        )
        let arrayChild = [...childsCategory];
        for (let child of childsCategory) {
            const getChild = await getChildCategory(child.id);
            arrayChild = arrayChild.concat(getChild);
        }
        return arrayChild;
    }

    const arrayCategory = await getChildCategory(categoryProduct.id);
    const products = await Product.find({
        status: "active",
        deleted: false,
        category: {
            $in: [categoryProduct.id, ...arrayCategory.map(c => c.id)]
        }
    });
    const newProducts = products.map((test) => {
        test.newPrice = priceString((test.price - test.price * test.discount / 100).toFixed(0));
        test.priceString = priceString(test.price);
        return test;
    });
    res.render("client/pages/products/index.pug", {
        titlePage: "Trang danh sach san pham",
        products: newProducts
    });

}

module.exports.viewDetel = async (req, res) => {
    const find = {
        deleted: false,
        status: "active",
        slug: req.params.slug
    }
    const product = await Product.findOne(find);
    if (product.price) {
        product.newPrice = priceString((product.price - product.price * product.discount / 100).toFixed(0));
        product.priceString = priceString(product.price);
    }
    const category = await Category.findOne({
        deleted: false,
        status: "active",
        _id: product.category
    })
    res.render("client/pages/products/detel.pug",
        {
            titlePage: "Chi tiết sản phẩm",
            product: product,
            category: category
        }
    )
}