const Category = require("../../models/category.model");
const paginationHeper = require("../../helper/pagination");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHeper = require("../../helper/search");
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status;

    }
    const ojectsSearch = searchHeper(req.query);
    if (ojectsSearch.keyword) {
        find.title = ojectsSearch.regex;
    }
    const filtersStatus = filterStatusHelper(req.query);
    const countOjects = await Category.countDocuments();
    const ojectPagination = paginationHeper(req.query, countOjects);
    let sort = {};
    if (req.query.sortKey && req.query.sortvalue) {
        sort[req.query.sortKey] = req.query.sortValue
    }
    else {
        sort.position = "desc";
    }
    const categorys = await Category.find(find).limit(ojectPagination.limitPage).skip(ojectPagination.skipPage).sort(sort);
    res.render("admin/pages/category/index.pug", {
        categorys: categorys,
        filtersStatus: filtersStatus,
        titlePage: "Trang loại sản phẩm",
        pagination: ojectPagination,
        keyword: ojectsSearch.keyword
    })
}
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Category.updateOne({ _id: id }, { status: status });
    req.flash("success", "Đổi trạng thái sản phẩm thành công!!");
    res.redirect("back");
}

module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(",");
    const type = req.body.type;
    switch (type) {
        case "active":
            await Category.updateMany(
                {
                    _id: { $in: ids }
                },
                { status: "active" }
            )
            req.flash("success", "Đổi trạng thái tất cả sản phẩm đã chọn thành công!!");
            break;
        case "inactive":
            await Category.updateMany(
                {
                    _id: { $in: ids }
                },
                { status: "inactive" }
            )
            req.flash("success", "Đổi trạng thái tất cả sản phẩm đã chọn thành công!!");
            break;
        case "delete":
            await Category.updateMany(
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
        case "change-position":
            for (const tmp of ids) {
                const [id, position] = tmp.split("-");
                const parsedPosition = parseInt(position);
                await Category.updateOne({ _id: id }, { position: parsedPosition });
            }
            req.flash("success", "Đổi vị trí tất cả sản phẩm đã chọn thành công!!");
            break;
    }
    res.redirect("back");
}
module.exports.createCategory = (req, res) => {
    res.render("admin/pages/category/createCategory.pug", {
        titlePage: "Tạo mới loại sản phẩm"
    })
}
module.exports.createNewCategory = async (req, res) => {
    if (!req.body.title) {
        req.flash("error", "Tên loại sản phẩm không được để trống!!");
        res.redirect("back");
        return;
    }
    if (!req.body.position) {
        const count = await Category.countDocuments();
        req.body.position = count + 1;
    }
    const category = new Category(req.body);
    category.save();
    req.flash("success", "Tạo mới loại sản phẩm thành công");
    res.redirect("back");
}