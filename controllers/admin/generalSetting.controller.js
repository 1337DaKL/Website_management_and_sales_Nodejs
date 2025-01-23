const GeneralSetting = require("../../models/generalSetting");
module.exports.index = async (req, res) => {
    const generalSetting = await GeneralSetting.findOne();
    res.render("admin/pages/generalSetting/index.pug",
        {
            titlePage: "Cài đặt chung",
            generalSetting: generalSetting
        }
    )
}
module.exports.updateInfor = async (req, res) => {
    if (!req.body.logo) {
        req.flash("error", "Ảnh logo không được trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.name) {
        req.flash("error", "Tên không được trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Email không được trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.footer) {
        req.flash("error", "Footer không được trống!");
        res.redirect("back");
        return;
    }
    const generalSetting = await GeneralSetting.findOne();
    if (generalSetting) {
        await GeneralSetting.updateOne(
            {
                _id: generalSetting.id
            },
            req.body
        )
    }
    else {
        const generalSeetingTmp = new GeneralSetting(req.body);
        await generalSeetingTmp.save();
    }
    req.flash("success", "Cập nhật thông tin website thành công!!");
    res.redirect("back");
}