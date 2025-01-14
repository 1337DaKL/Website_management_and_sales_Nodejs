module.exports.index = (req, res) => {
    res.render("admin/pages/myAccount/index.pug", {
        titlePage: `Thông tin cá nhân ${res.locals.userLogin.fullName}`,
    })
}
module.exports.viewEdit = (req, res) => {
    res.render("admin/pages/myAccount/edit.pug", {
        titlePage: `Chỉnh sửa thông tin cá nhân ${res.locals.userLogin.fullName}`,
    })
}