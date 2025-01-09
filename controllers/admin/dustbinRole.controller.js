const Role = require("../../models/role.model");
module.exports.index = async (req , res) => {
    let find = {
        deleted : true
    }
    const rolesDeleted = await Role.find(find);
    res.render("admin/pages/dustbinRole/index.pug" , {
        titlePage : "Thùng rác quyền quản trị",
        roles : rolesDeleted
    })
}
module.exports.restoreRole = async (req , res) => {
    await Role.updateOne({_id : req.params.id} , {deleted : false});
    req.flash("success" , "Khôi phục thành công!!");
    res.redirect("back");
}


