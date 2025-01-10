const Role = require("../../models/role.model")
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const roles = await Role.find(find);
    res.render("admin/pages/role/index.pug", {
        titlePage: "Trang phân quyền",
        roles: roles
    })
}
module.exports.viewCreate = async (req, res) => {
    res.render("admin/pages/role/create.pug", {
        titlePage: "Trang tạo các quyền quản trị",
    })
}
module.exports.createRole = async (req, res) => {
    if (!req.body.title) {
        req.flash("error", "Tiêu đề không được bỏ trống");
        res.redirect("back");
        return;

    }
    const role = new Role(req.body);
    await role.save();
    req.flash("success", "Tạo quyền mới thành công!!");
    res.redirect("back");
}
module.exports.viewEditRole = async (req, res) => {
    const role = await Role.findOne({ _id: req.params.id });
    res.render("admin/pages/role/edit.pug", {
        titlePage: "Chỉnh sửa quyền",
        role: role
    })
}
module.exports.editRole = async (req, res) => {
    console.log(req.body);
    if (!req.body.title) {
        req.flash("error", "Tiêu đề không được trống");
        res.redirect("back");
        return;
    }
    await Role.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Chỉnh sửa thành công");
    res.redirect("back");
    // res.send("ok");
}
module.exports.deleteRole = async (req, res) => {
    await Role.updateOne({ _id: req.params.id }, { $set: { deleted: true, dateDeleted: new Date() } });
    req.flash("success", "Xóa thành công!!");
    res.redirect("back");
}
module.exports.deleteMultiRole = async (req, res) => {
    const idRoles = req.params.id.split(",");
    if (idRoles.length == 0) {
        req.flash("error", "Bạn chưa chọn quyền nào để xóa??");
        res.redirect("back");
        return;
    }
    await Role.updateMany({ _id: idRoles }, { $set: { deleted: true, dateDeleted: new Date() } });
    req.flash("success", "Xóa tất cả thành công");
    res.redirect("back");
}
module.exports.viewPagePemission = async (req, res) => {
    let find = {
        deleted: false
    }
    const roles = await Role.find(find);
    res.render("admin/pages/role/permission.pug", {
        titlePage: "Trang phân quyền",
        roles: roles
    })
}
module.exports.updatePermissionRole = async (req, res) => {
    const permissionJson = JSON.parse(req.body.permission);
    console.log(permissionJson);
    for (let tmp in permissionJson) {
        await Role.updateOne({ _id: permissionJson[tmp].id }, { permission: permissionJson[tmp].permission });
    }
    req.flash("success", "Cập nhật phân quyền thành công");
    res.redirect("back");
    // res.send("ok");
}
