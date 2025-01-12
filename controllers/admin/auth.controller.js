const Account = require("../../models/account.model");
var md5 = require('md5');
const prefixSystem = require("../../configs/systems");
const prefixAdmin = prefixSystem.prefixAdmin;
module.exports.viewLogin = async (req, res) => {
    if (req.cookies.token) {
        const account = await Account.findOne({
            deleted: false,
            token: req.cookies.token
        })
        console.log(account);
        if (account) {
            res.render("admin/pages/dashboard/index.pug");
        }
    }
    res.render("admin/pages/auth/login", {
        titlePage: "Trang đăng nhập"
    })
}
module.exports.login = async (req, res) => {
    try {
        const emailLogin = req.body.email;
        const passwordLogin = req.body.password;
        if (!emailLogin || !passwordLogin) {
            req.flash("error", "Đăng nhập thất bại!");
            res.redirect("back");
            return;
        }
        const account = await Account.findOne({
            deleted: false,
            email: emailLogin
        });
        if (!account) {
            req.flash("error", "Email không tồn tại =((");
            res.redirect("back");
            return;
        }
        if (md5(passwordLogin) !== account.password) {
            req.flash("error", "Mật khẩu không chính xác ? Bạn tính hack à :3");
            res.redirect("back");
            return;
        }
        if (account.status == "inactive") {
            req.flash("error", "Tài khoản đã bị khóa!! Hãy liên hệ với quản trị viên :3");
            res.redirect("back");
            return;
        }
        req.flash("success", "Đăng nhập thành công :3");
        res.cookie("token", account.token);
        res.redirect(`${prefixAdmin}/dashboard`);
    } catch (error) {
        req.flash("Đăng nhập thất bại!");
        res.redirect("back");
    }
}
module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect(`${prefixAdmin}/auth/login`);
}