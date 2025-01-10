const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
var md5 = require('md5');
const systemConfig = require("../../configs/systems");
module.exports.index = async (req, res) => {
    const accounts = await Account.find({
        deleted: false
    }).select("-password -token");
    for (let account of accounts) {
        const role = await Role.findOne({
            deleted: false,
            _id: account.idRole
        })
        account.role = role;
    }
    res.render("admin/pages/account/index.pug", {
        titlePage: "Tài khoản",
        accounts: accounts
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
        deleted: false,
        email: req.body.email
    })
    if (accountFindEqual) {
        req.flash("error", "Email đã tồn tại =((");
        res.redirect("back");
        return;
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
        await Account.updateOne({ _id: req.params.id }, {
            deleted: true
        })
        req.flash("success", "Chuyển tài khoản vào thùng rác thành công :3");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Chuyển tài khoản vào thùng rác thất bại =((");
        res.redirect("back");
    }
}