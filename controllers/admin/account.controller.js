const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
var md5 = require('md5');
const systemConfig = require("../../configs/systems");
const formatHelper = require("../../helper/formatDay");
const searchHeper = require("../../helper/search");
const paginationHeper = require("../../helper/pagination");
const filterStatusHelper = require("../../helper/filterStatus");
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const filtersStatus = filterStatusHelper(req.query);
    if (req.query.status) {
        find.status = req.query.status;
    }
    const ojectsSearch = searchHeper(req.query);
    if (ojectsSearch.keyword) {
        find.fullName = ojectsSearch.regex;
    }
    const countOjects = await Account.countDocuments(find);
    const ojectPagination = paginationHeper(req.query, countOjects);
    const accounts = await Account.find(find).limit(ojectPagination.limitPage).skip(ojectPagination.skipPage).select("-password -token");
    for (let account of accounts) {
        const role = await Role.findOne({
            deleted: false,
            _id: account.idRole
        })
        account.role = role;
        const accountCreated = await Account.findOne({ _id: account.createdBy.idAccountCreated });
        if (accountCreated) {
            account.nameAccountCreated = accountCreated.fullName;
        }
    }
    res.render("admin/pages/account/index.pug", {
        titlePage: "Tài khoản",
        keyword: ojectsSearch.keyword,
        accounts: accounts,
        pagination: ojectPagination,
        filtersStatus: filtersStatus
    })
}
module.exports.viewCreateAccount = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    })
    res.render("admin/pages/account/create.pug", {
        titlePage: "Tạo tài khoản",
        roles: roles
    })
}
module.exports.createAccount = async (req, res) => {
    if (!req.body.fullName || !req.body.email || !req.body.password) {
        req.flash("error", "Bạn phải điền đầy đủ thông tin tên, email, mật khẩu");
        res.redirect("back");
        return;
    }
    req.body.password = md5(req.body.password);
    if (!req.body.idRole) {
        req.flash("error", "Phải chọn quyền quản trị!!");
        res.redirect("back");
        return;
    }
    const accountFindEqual = await Account.findOne({
        email: req.body.email
    })
    if (accountFindEqual) {
        req.flash("error", "Email đã tồn tại =((");
        res.redirect("back");
        return;
    }
    const createdBy = {
        idAccountCreated: res.locals.userLogin.id
    }
    if (createdBy) {
        req.body.createdBy = createdBy;
    }

    const account = new Account(req.body);
    account.save();
    req.flash("success", "Tạo tài khoản thành công =))");
    res.redirect(`${systemConfig.prefixAdmin}/account`);
}
module.exports.changeStatus = async (req, res) => {
    try {
        const [id, statusChange] = req.params.inforChange.split(",");
        await Account.updateOne({ _id: id }, { status: statusChange });
        req.flash("success", "Cập nhật trạng thái thành công!!");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Cập nhật trạng thái thất bại =((");
        res.redirect("back");
    }
}
module.exports.deleteAccount = async (req, res) => {
    try {
        const deletedBy = {
            idAccountDeleted: res.locals.userLogin.id,
            dateDeleted: new Date()
        }
        await Account.updateOne({ _id: req.params.id }, { $set: { deleted: true, deletedBy: deletedBy } })
        req.flash("success", "Chuyển tài khoản vào thùng rác thành công :3");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Chuyển tài khoản vào thùng rác thất bại =((");
        res.redirect("back");
    }
}
module.exports.viewDetelAccount = async (req, res) => {
    const account = await Account.findOne({ _id: req.params.id });
    const roleAccount = await Role.findOne({ _id: account.idRole });
    account.role = roleAccount;
    const createdAtNew = formatHelper.formatDate(String(account.createdAt));
    const updatedAtNew = formatHelper.formatDate(String(account.updatedAt));
    res.render("admin/pages/account/detel.pug", {
        titlePage: "Chi tiết tài khoản ",
        account: account,
        createdAtNew: createdAtNew,
        updatedAtNew: updatedAtNew
    })
}
module.exports.viewEdit = async (req, res) => {
    const account = await Account.findOne({ _id: req.params.id });
    const roleAccount = await Role.findOne({
        deleted: false,
        _id: account.idRole
    })
    account.role = roleAccount;
    const roles = await Role.find({
        deleted: false
    })
    res.render("admin/pages/account/edit.pug", {
        titlePage: "Chỉnh sửa tài khoản",
        account: account,
        roles: roles
    })
}
module.exports.editAccount = async (req, res) => {
    if (!req.body.fullName || !req.body.email) {
        req.flash("error", "Tên và email không được bỏ trống!!");
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        delete req.body.password
    }
    else {
        req.body.password = md5(req.body.password);
    }
    const emailEq = await Account.findOne({
        _id: { $ne: req.params.id },
        deleted: false,
        email: req.body.email
    });
    if (emailEq) {
        req.flash("error", "Email đã tồn tại vui lòng đổi email khác!");
        res.redirect("back");
        return;
    }
    try {
        await Account.updateOne(
            {
                _id: req.params.id
            },
            req.body
        )
        req.flash("success", "Cập nhật thông tin thành công!");
        res.redirect(`${systemConfig.prefixAdmin}/account`);
    } catch (error) {
        req.flash("error", "Cập nhật thông tin thất bại!");
        res.redirect("back");
    }
}
module.exports.changeMulti = async (req, res) => {
    try {
        const ids = req.body.ids.split(",");
        const type = req.body.type;
        switch (type) {
            case "active":
                await Account.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    { status: "active" }
                )
                req.flash("success", "Thay đổi thành trạng thái hoạt động thành công !!")
                res.redirect("back");
                break;
            case "inactive":
                await Account.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    { status: "inactive" }
                )
                req.flash("success", "Thay đổi thành trạng thái dừng hoạt động thành công !!")
                res.redirect("back");
                break;
            case "delete":
                const deletedBy = {
                    idAccountDeleted: res.locals.userLogin.id,
                    dateDeleted: new Date()
                }
                await Account.deleteMany({
                    _id: { $in: ids }
                },
                    { $set: { deleted: true, deletedBy: deletedBy } }
                )
                req.flash("success", "Xóa thành công !!")
                res.redirect("back");
                break;
            default:
                break;
        }
    } catch (error) {
        req.flash("error", "Thực hiện hành động thất bại!!!");
        res.redirect("back");
        return;
    }
}