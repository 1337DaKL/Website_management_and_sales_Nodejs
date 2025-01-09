const Role = require("../../models/role.model");
const priceString = require("../../helper/chuanHoaGiaHang");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHeper = require("../../helper/search");
const paginationHeper = require("../../helper/pagination");
module.exports.index = async (req , res) => {
    let find = {
        deleted : true
    }
    // pagination
    const countOjects = await Role.countDocuments(find);
    const ojectPagination = paginationHeper(req.query , countOjects);
    // end pagination
    //search
    const searchDustbin = searchHeper(req.query);
    if(searchDustbin.keyword)
    {
        find.title = searchDustbin.regex;
    }
    //end search
    const roles = await Role.find(find).limit(ojectPagination.limitPage).skip(ojectPagination.skipPage);;
    res.render("admin/pages/dustbinRole/index.pug" , {
        titlePage : "Thùng rác quản trị",
        roles : roles,
        keyword: searchDustbin.keyword,
        pagination: ojectPagination
    })
}
module.exports.restoreRole = async (req, res) => {

    try {
        await Role.updateOne({ _id: req.params.id }, { deleted: false });
        req.flash("success", "Khôi phục thành công!!");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Khôi phục thất bại!!");
        res.redirect("back");
    }
}
module.exports.deleteRole = async (req, res) => {
    try {
        await Role.deleteOne({ _id: req.params.id });
        req.flash("success", "Xóa thành công!!");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Xóa thất bại");
        res.redirect("back");
    }
}
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(",");
    const type = req.body.type;
    switch (type) {
        case "restore":
            try {
                await Role.updateMany({ _id: ids }, { deleted: false });
                req.flash("success", "Khôi phục thành công");
                res.redirect("back");
                return;
            } catch (error) {
                req.flash("error", "Khôi phục thất bại do một số lỗi ");
                res.redirect("back");
            }
        case "delete":
            try {
                await Role.deleteMany({ _id: ids });
                req.flash("success", "Xóa thành công");
                res.redirect("back");
                return;
            } catch (error) {
                req.flash("error", "Xóa thất bại do một số lỗi ");
                res.redirect("back");
            }
        default:
            break;
    }
    res.redirect("back");
}


