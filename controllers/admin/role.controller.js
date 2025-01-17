const Role = require("../../models/role.model")
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const roles = await Role.find(find);
    for (let role of roles) {
        const arrayUpdatedBy = role.updatedBy;
        if (arrayUpdatedBy.length > 0) {
            const lastUpdatedBy = arrayUpdatedBy[arrayUpdatedBy.length - 1];
            role.lastUpdatedBy = lastUpdatedBy;
        }
    }
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
    if (res.locals.roleLogin.permission.includes("role_create")) {
        if (!req.body.title) {
            req.flash("error", "Tiêu đề không được bỏ trống");
            res.redirect("back");
            return;

        }
        const createdBy = {
            idAccountCreated: res.locals.userLogin.id,
            nameAccountUpdated: res.locals.userLogin.fullName
        }
        if (createdBy) {
            req.body.createdBy = createdBy
        }
        const role = new Role(req.body);
        await role.save();
        req.flash("success", "Tạo quyền mới thành công!!");
        res.redirect("back");
    }
    else {
        res.send("Hack faild");
    }

}
module.exports.viewEditRole = async (req, res) => {
    const role = await Role.findOne({ _id: req.params.id });
    res.render("admin/pages/role/edit.pug", {
        titlePage: "Chỉnh sửa quyền",
        role: role
    })
}
module.exports.editRole = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("role_edit")) {
        try {
            console.log(req.body);
            if (!req.body.title) {
                req.flash("error", "Tiêu đề không được trống");
                res.redirect("back");
                return;
            }
            const updatedBy = {
                idAccountUpdated: res.locals.userLogin.id,
                nameAccountUpdated: res.locals.userLogin.fullName,
                dateUpdated: new Date()
            }
            const oldRole = await Role.findOne({ _id: req.params.id, deleted: false }).select("title description permission");
            await Role.updateOne({ _id: req.params.id }, req.body);
            const newRole = await Role.findOne({ _id: req.params.id, deleted: false }).select("title description permission");
            await Role.updateOne(
                { _id: req.params.id },
                {
                    $push: {
                        updatedBy: {
                            ...updatedBy,
                            oldRole: oldRole,
                            newRole: newRole
                        }
                    }
                }
            )
            req.flash("success", "Chỉnh sửa thành công");
            res.redirect("back");
        } catch (error) {
            req.flash("error", "Chỉnh sửa không thành công");
            res.redirect("back");
        }
        // res.send("ok");
    }
    else {
        res.send("Hack faild");
    }

}
module.exports.deleteRole = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("role_delete")) {
        const deletedBy = {
            idAccountDeleted: res.locals.userLogin.id,
            nameAccountUpdated: res.locals.userLogin.fullName,
            dateDeleted: new Date()
        }
        await Role.updateOne({ _id: req.params.id }, { $set: { deleted: true, deletedBy: deletedBy } });
        req.flash("success", "Xóa thành công!!");
        res.redirect("back");
    }
    else {
        res.send("Hack faild");
    }

}
module.exports.deleteMultiRole = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("role_delete")) {
        const idRoles = req.params.id.split(",");
        if (idRoles.length == 0) {
            req.flash("error", "Bạn chưa chọn quyền nào để xóa??");
            res.redirect("back");
            return;
        }
        const deletedBy = {
            idAccountDeleted: res.locals.userLogin.id,
            nameAccountUpdated: res.locals.userLogin.fullName,
            dateDeleted: new Date()
        }
        await Role.updateMany({ _id: idRoles }, { $set: { deleted: true, deletedBy: deletedBy } });
        req.flash("success", "Xóa tất cả thành công");
        res.redirect("back");
    }
    else {
        res.send("Hack faild");
    }

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
    if (res.locals.roleLogin.permission.includes("role_permission")) {
        try {
            const permissionJson = JSON.parse(req.body.permission);
            const updatedBy = {
                idAccountUpdated: res.locals.userLogin.id,
                nameAccountUpdated: res.locals.userLogin.fullName,
                dateUpdated: new Date()
            }
            for (let tmp in permissionJson) {
                const oldRole = await Role.findOne(
                    {
                        _id: permissionJson[tmp].id
                    }
                ).select("title description permission");
                await Role.updateOne({ _id: permissionJson[tmp].id }, { permission: permissionJson[tmp].permission });
                const newRole = await Role.findOne(
                    {
                        _id: permissionJson[tmp].id
                    }
                ).select("title description permission");
                await Role.updateOne(
                    {
                        _id: permissionJson[tmp].id
                    },
                    {
                        $push: {
                            updatedBy: {
                                ...updatedBy,
                                oldRole: oldRole,
                                newRole: newRole
                            }
                        }
                    }
                )
            }
            // res.send("ok");
            req.flash("success", "Cập nhật phân quyền thành công");
            res.redirect("back");
        } catch (error) {
            req.flash("error", "Cập nhật phân quyền không thành công");
            res.redirect("back");
        }
    }
    else {
        res.send("Hack faild");
    }

}
module.exports.viewLogUpdated = async (req, res) => {
    const role = await Role.findOne(
        {
            _id: req.params.id,
            deleted: false
        }
    );
    let arrayUpdatedBy;
    if (role.updatedBy.length > 0) {
        arrayUpdatedBy = role.updatedBy;
    }
    res.render("admin/pages/role/log.pug", {
        titlePage: "Lịch sử cập nhật quyền quản trị",
        arrayUpdatedBy: arrayUpdatedBy
    })
}
