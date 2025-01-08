const Role = require("../../models/role.model")
module.exports.index = async  (req, res) => {
    let find = {
        deleted :  false
    }
    const roles  = await Role.find(find);
    res.render("admin/pages/role/index.pug", {
        titlePage: "Trang phân quyền",
        roles : roles
    })
}
module.exports.viewCreate =async (req, res) => {
    res.render("admin/pages/role/create.pug", {
        titlePage: "Trang tạo các quyền quản trị",
    })
}
module.exports.createRole = async  (req, res) => {
    if(!req.body.title)
    {
        req.flash("error" , "Tiêu đề không được bỏ trống");
        res.redirect("back");
        return;
        
    }
    const role = new Role(req.body);
    await role.save();
    req.flash("success" , "Tạo quyền mới thành công!!");
    res.redirect("back");
}
module.exports.viewEditRole = async (req , res) => {
    const role = await Role.findOne({_id : req.params.id});
    res.render("admin/pages/role/edit.pug" , {
        titlePage : "Chỉnh sửa quyền",
        role : role
    })
}
module.exports.editRole = async (req , res) => {
    console.log(req.body);
    if(!req.body.title)
    {
        req.flash("error" , "Tiêu đề không được trống");
        res.redirect("back");
        return;
    }
    await Role.updateOne({_id : req.params.id} , req.body);
    req.flash("success" , "Chỉnh sửa thành công");
    res.redirect("back");
    // res.send("ok");
}