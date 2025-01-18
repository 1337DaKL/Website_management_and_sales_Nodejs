const Product = require("../../models/products.model");
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
        status: "active"
    }
    const search = {
        keyword: ""
    };
    if (req.query.keyword) {
        search.keyword = req.query.keyword;
        const regex = new RegExp(search.keyword, "i");
        search.regex = regex;
    }
    if (search.regex) {
        find.title = search.regex;
    }
    const pagination = {
        currentPage: 1,
        limitPage: 12
    }
    if (req.query.page) {
        pagination.currentPage = req.query.page
    }
    const countProduct = await Product.countDocuments(find);
    const totalPage = Math.ceil(countProduct / pagination.limitPage);
    const skipPage = (pagination.currentPage - 1) * pagination.limitPage;
    if (totalPage) {
        pagination.totalPage = totalPage;
    }
    if (skipPage) {
        pagination.skipPage = skipPage;
    }
    const products = await Product.find(find).limit(pagination.limitPage).skip(pagination.skipPage);
    res.render("client/pages/search/index.pug", {
        titlePage: "Kết quả tìm kiếm",
        products: products,
        pagination: pagination,
        countProduct: countProduct,
        keyword: req.query.keyword
    })
}