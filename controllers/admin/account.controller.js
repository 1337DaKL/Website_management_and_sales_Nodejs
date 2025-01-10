module.exports.index = (req, res) => {
    res.render("admin/pages/account/index.pug", {
        titlePage: "Tài khoản"
    })
}
module.exports.viewCreateAccount = (req, res) => {
    res.render("admin/pages/account/create.pug", {
        titlePage: "Tạo tài khoản"
    })
}
module.exports.createAccount = async (req, res) => {
    if (!req.body.fullName || !req.body.email || !req.body.password) {
        req.flash("error", "Bạn phải điền đầy đủ thông tin tên, email, mật khẩu");
        res.redirect("back");
        return;
    }
    res.send("ok");
}