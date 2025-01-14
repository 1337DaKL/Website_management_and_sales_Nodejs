const Category = require("../../models/category.model");
const searchHeper = require("../../helper/search");
const paginationHeper = require("../../helper/pagination");
const filterStatusHelper = require("../../helper/filterStatus");
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
    const countOjects = await Category.countDocuments(find);
    const ojectPagination = paginationHeper(req.query, countOjects);
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else {
        sort.position = "desc";
    }
    const categorys = await Category.find(find).limit(ojectPagination.limitPage).skip(ojectPagination.skipPage).sort(sort);
    res.render("admin/pages/dustbinCategory/index.pug", {
        titlePage: "Thùng rác danh mục sản phẩm",
        categorys: categorys,
        filtersStatus: filtersStatus,
        keyword: ojectsSearch.keyword,
        pagination: ojectPagination
    })
}
module.exports.restoreCategory = async (req, res) => {
    console.log(req.params.id);
    await Category.updateOne(
        {
            _id: req.params.id
        },
        {
            deleted: false
        }
    )
    req.flash("success", "Khôi phục danh mục sản phẩm thành công!!");
    res.redirect("back");
}
module.exports.deleteCategory = async (req, res) => {
    const id = req.params.id;
    await Category.deleteOne({ _id: id });
    req.flash("success", "Xóa danh mục sản phẩm thành công!!");
    res.redirect("back");
}

module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(",");
    const type = req.body.type;
    switch (type) {
        case "restore":
            await Category.updateMany(
                {
                    _id: { $in: ids }
                },
                { deleted: false }
            )
            req.flash("success", "Khôi phục sản phẩm thành công!!");
            break;
        case "delete":
            await Category.deleteMany(
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