const Product = require("../../models/products.model")
const priceString = require("../../helper/chuanHoaGiaHang");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHeper = require("../../helper/search");
const paginationHeper = require("../../helper/pagination");
const { model } = require("mongoose");
const Category = require("../../models/category.model");
const findTreeContro = require("../../helper/findTree");
const formatHelper = require("../../helper/formatDay");
module.exports.index = async (req, res) => {
    //Filter status
    const filtersStatus = filterStatusHelper(req.query);
    // End filter status
    let find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status;

    }
    //Search
    const ojectsSearch = searchHeper(req.query);
    if (ojectsSearch.keyword) {
        find.title = ojectsSearch.regex;
    }
    //End Search

    //Pagination
    const countOjects = await Product.countDocuments(find);
    const ojectPagination = paginationHeper(req.query, countOjects);
    //End Pagination
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else {
        sort.position = "desc";
    }
    const products = await Product.find(find).limit(ojectPagination.limitPage).skip(ojectPagination.skipPage).sort(sort);

    //Chuan hoa lai price
    const newProducts = products.map((tmp) => {
        tmp.priceString = priceString(tmp.price);
        return tmp;
    })
    //End Chuan hoa lai price


    res.render("admin/pages/products/index.pug", {
        titlePage: "Trang san pham admin",
        products: newProducts,
        filtersStatus: filtersStatus,
        keyword: ojectsSearch.keyword,
        pagination: ojectPagination
    })
}
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { status: status });
    req.flash("success", "Đổi trạng thái sản phẩm thành công!!");
    res.redirect("back");
}

module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(",");
    const type = req.body.type;
    switch (type) {
        case "active":
            await Product.updateMany(
                {
                    _id: { $in: ids }
                },
                { status: "active" }
            )
            req.flash("success", "Đổi trạng thái tất cả sản phẩm đã chọn thành công!!");
            break;
        case "inactive":
            await Product.updateMany(
                {
                    _id: { $in: ids }
                },
                { status: "inactive" }
            )
            req.flash("success", "Đổi trạng thái tất cả sản phẩm đã chọn thành công!!");
            break;
        case "delete":
            await Product.updateMany(
                {
                    _id: { $in: ids }
                },
                {
                    $set: {
                        deleted: true,
                        dateDeleted: new Date()
                    }
                }
            )
            req.flash("success", "Xóa sản phẩm thành công!!");
            break;
        case "change-position":
            for (const tmp of ids) {
                const [id, position] = tmp.split("-");
                const parsedPosition = parseInt(position);
                await Product.updateOne({ _id: id }, { position: parsedPosition });
            }
            req.flash("success", "Đổi vị trí tất cả sản phẩm đã chọn thành công!!");
            break;
    }
    res.redirect("back");
}

module.exports.deleteProduct = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { $set: { deleted: true, dateDeleted: new Date() } });
    req.flash("success", "Xóa sản phẩm thành công!!");
    res.redirect("back");
}

module.exports.create = async (req, res) => {
    const category = await Category.find({deleted : false});
    const level = findTreeContro(category);
    res.render("admin/pages/products/create.pug", {
        titlePage: "Trang tạo mới sản phẩm",
        levell : level
    })
}

module.exports.createNewProduct = async (req, res) => {
    if (!req.body.title) {
        req.flash("error", "Sản phẩm bạn tạo bắt buộc phải có tên sản phẩm !!")
        res.redirect("back");
        return;
    }
    if (req.body.discount != "") {
        req.body.discount = parseInt(req.body.discount);
    }
    if (req.body.price != "") {
        req.body.price = parseInt(req.body.price + "000");
    }
    if (req.body.stock) {
        req.body.stock = parseInt(req.body.stock);
    }
    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }

    const product = new Product(req.body);
    await product.save();
    req.flash("success", "Tạo mới sản phẩm thành công!!");
    res.redirect("back");
}


module.exports.editProduct = async (req, res) => {
    try {
        const category = await Category.find({deleted : false});
        const level = findTreeContro(category);
        let find = {
            _id: req.params.id,
            deleted: false
        }
        const productID = await Product.findOne(find);
        productID.price = productID.price.toString().substring(0, productID.price.toString().length - 3);
        const cate = await Category.findOne({_id : productID.category});
        res.render("admin/pages/products/edit.pug", {
            titlePage: "Chỉnh sửa sản phẩm",
            product: productID,
            levell : level,
            cate : cate
        })
    } catch (error) {
        res.redirect("back");
    }
}

module.exports.editProductInDatabase = async (req, res) => {
    if (!req.body.title) {
        req.flash("error", "Sản phẩm bắt buộc phải có tên sản phẩm !!")
        res.redirect("back");
        return;
    }
    if (req.body.discount != "") {
        req.body.discount = parseInt(req.body.discount);
    }
    if (req.body.price != "") {
        req.body.price = parseInt(req.body.price + "000");
    }
    if (req.body.stock) {
        req.body.stock = parseInt(req.body.stock);
    }
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    }
    try {
        await Product.updateOne({ _id: req.params.id }, req.body);
        req.flash("success", "Chỉnh sửa sản phẩm thành công!!");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Chỉnh sửa sản phẩm thất bại!!");
        res.redirect("back");
    }
}

module.exports.detelProduct = async (req, res) => {
    try {
        let find = {
            _id: req.params.id,
            deleted: false
        }
        const productDetel = await Product.findOne(find);
        const createdAtNew = formatHelper.formatDate(String(productDetel.createdAt));
        const updatedAtNew = formatHelper.formatDate(String(productDetel.updatedAt));
        res.render("admin/pages/products/detel.pug", {
            title: `Chi tiết sản phầm ${productDetel.title}`,
            product: productDetel,
            priceString: priceString(productDetel.price),
            createdAtNew : createdAtNew ,
            updatedAtNew : updatedAtNew
        })
    }
    catch (error) {
        res.redirect("back");
    }
}