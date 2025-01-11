const Product = require("../../models/products.model");
const priceString = require("../../helper/chuanHoaGiaHang");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHeper = require("../../helper/search");
const paginationHeper = require("../../helper/pagination");
const formatHelper = require("../../helper/formatDay");
module.exports.index = async (req , res) => {
    //Filter status
    const filtersStatus = filterStatusHelper(req.query);
    // End filter status
    let find = {
        deleted: true
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
        tmp.dateDeletedNew = formatHelper.formatDate(String(tmp.dateDeleted));
        return tmp;
    })
    //End Chuan hoa lai price

    res.render("admin/pages/dustbinProduct/index.pug", {
        titlePage: "Thùng rác sản phẩm",
        products: newProducts,
        filtersStatus: filtersStatus,
        keyword: ojectsSearch.keyword,
        pagination: ojectPagination
    })
}
module.exports.restoreProduct =  async(req , res) => {
    const id = req.params.id;
    await Product.updateOne({_id : id} , {deleted : false});
    req.flash("success" , "Khôi phục sản phẩm thành công!!");
    res.redirect("back");
}
module.exports.deleteProduct = async(req , res) => {
    const id = req.params.id;
    await Product.deleteOne({_id : id});
    req.flash("success" , "Xóa sản phẩm thành công!!");
    res.redirect("back");
}

module.exports.changeMulti = async (req , res) => {
    const ids = req.body.ids.split(",");
    const type = req.body.type;
    switch (type)
    {
        case "restore":
            await Product.updateMany(
                {
                    _id : {$in : ids}
                },
                {deleted : false}
            )
            req.flash("success" , "Khôi phục sản phẩm thành công!!");
            break;
        case "delete" :
            await Product.deleteMany(
                {
                    _id : {$in : ids}
                }
            )
            req.flash("success" , "Xóa sản phẩm thành công!!");
            break;
        default:
            break;
    }
    res.redirect("back");
}

