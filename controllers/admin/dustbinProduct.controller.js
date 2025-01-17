const Product = require("../../models/products.model");
const priceString = require("../../helper/chuanHoaGiaHang");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHeper = require("../../helper/search");
const paginationHeper = require("../../helper/pagination");
const formatHelper = require("../../helper/formatDay");
const Account = require("../../models/account.model")
module.exports.index = async (req, res) => {
    const filtersStatus = filterStatusHelper(req.query);
    let find = {
        deleted: true
    }
    if (req.query.status) {
        find.status = req.query.status;

    }
    const ojectsSearch = searchHeper(req.query);
    if (ojectsSearch.keyword) {
        find.title = ojectsSearch.regex;
    }
    const countOjects = await Product.countDocuments(find);
    const ojectPagination = paginationHeper(req.query, countOjects);
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else {
        sort.position = "desc";
    }
    const products = await Product.find(find).limit(ojectPagination.limitPage).skip(ojectPagination.skipPage).sort(sort);
    for (let tmp of products) {
        tmp.priceString = priceString(tmp.price);
        const accountDeleted = await Account.findOne({ _id: tmp.deletedBy.idAccountDeleted });
        if (accountDeleted) {
            tmp.nameAccountDeleted = accountDeleted.fullName;
        }
    };
    res.render("admin/pages/dustbinProduct/index.pug", {
        titlePage: "Thùng rác sản phẩm",
        products: products,
        filtersStatus: filtersStatus,
        keyword: ojectsSearch.keyword,
        pagination: ojectPagination
    })
}
module.exports.restoreProduct = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("products_edit-dustbin")) {
        const id = req.params.id;
        await Product.updateOne({ _id: id }, { deleted: false });
        req.flash("success", "Khôi phục sản phẩm thành công!!");
        res.redirect("back");
    }
    else {
        res.send("Hack faild");
    }

}
module.exports.deleteProduct = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("products_edit-dustbin")) {
        const id = req.params.id;
        await Product.deleteOne({ _id: id });
        req.flash("success", "Xóa sản phẩm thành công!!");
        res.redirect("back");
    }
    else {
        res.send("Hack faild");
    }

}

module.exports.changeMulti = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("products_edit-dustbin")) {
        const ids = req.body.ids.split(",");
        const type = req.body.type;
        switch (type) {
            case "restore":
                await Product.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    { deleted: false }
                )
                req.flash("success", "Khôi phục sản phẩm thành công!!");
                break;
            case "delete":
                await Product.deleteMany(
                    {
                        _id: { $in: ids }
                    }
                )
                req.flash("success", "Xóa sản phẩm thành công!!");
                break;
            default:
                break;
        }
        res.redirect("back");
    }
    else {
        res.send("Hack faild");
    }

}

