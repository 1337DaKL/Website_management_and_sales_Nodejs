const Product = require("../../models/products.model");
const priceString = require("../../helper/chuanHoaGiaHang");
const Category = require("../../models/category.model");
module.exports.index = async (req, res) => {
    let find = {
        status: "active",
        deleted: false
    }
    const pagination = {
        limitPage: 12,
        currentPage: 1
    }
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination.skipPage = (pagination.currentPage - 1) * pagination.limitPage;
    const countProducts = await Product.countDocuments(find);
    pagination.totalPage = Math.ceil(countProducts / pagination.limitPage);
    const products = await Product.find(find).limit(pagination.limitPage).skip(pagination.skipPage);
    const newProducts = products.map((test) => {
        test.newPrice = priceString((test.price - test.price * test.discount / 100).toFixed(0));
        test.priceString = priceString(test.price);
        return test;
    });
    res.render("client/pages/products/index.pug", {
        titlePage: "Trang danh sach san pham",
        products: newProducts,
        pagination: pagination
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
    let find = {
        status: "active",
        deleted: false,
        category: {
            $in: [categoryProduct.id, ...arrayCategory.map(c => c.id)]
        }
    }
    const pagination = {
        limitPage: 12,
        currentPage: 1
    }
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination.skipPage = (pagination.currentPage - 1) * pagination.limitPage;
    const countProducts = await Product.countDocuments(find);
    pagination.totalPage = Math.ceil(countProducts / pagination.limitPage);
    const products = await Product.find(find).limit(pagination.limitPage).skip(pagination.skipPage);
    const newProducts = products.map((test) => {
        if(test.price)
        {
            test.newPrice = priceString((test.price - test.price * test.discount / 100).toFixed(0));
            test.priceString = priceString(test.price);
        }
        return test;
    });
    res.render("client/pages/products/index.pug", {
        titlePage: "Trang danh sach san pham",
        products: newProducts,
        pagination : pagination
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
    let category = "No";
    if(product.category)
    {
        category = await Category.findOne({
            deleted: false,
            status: "active",
            _id: product.category
        })
    }
    res.render("client/pages/products/detel.pug",
        {
            titlePage: "Chi tiết sản phẩm",
            product: product,
            category: category
        }
    )
}