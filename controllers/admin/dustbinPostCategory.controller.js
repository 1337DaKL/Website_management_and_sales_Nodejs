const PostCategory = require("../../models/postCategory.model");
const searchHelper = require("../../helper/search");
module.exports.index = async (req, res) => {
    let find = {
        deleted: true
    }
    const searchObject = searchHelper(req.query);
    if (searchObject.regex) {
        find.title = searchObject.regex;
    }
    const postCategory = await PostCategory.find(find);
    res.render("admin/pages/dustbinPostCategory/index.pug", {
        titlePage: "Thùng rác danh mục bài viết",
        postCategory: postCategory,
        keyword: searchObject.keyword
    })
}
module.exports.restorePostCategory = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("post-category_edit-dustbin")) {
        try {
            await PostCategory.updateOne(
                {
                    _id: req.params.id
                },
                {
                    deleted: false
                }
            )
            req.flash("success", "Khôi phục danh mục bài viết thành công");
            res.redirect("back");
        } catch (error) {
            req.flash("error", "Khôi phục danh mục bài viết không thành công");
            res.redirect("back");
        }
    }
    else {
        res.send("Hack faild");
    }
}
module.exports.deletePostCategory = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("post-category_edit-dustbin")) {
        try {
            await PostCategory.deleteOne(
                {
                    _id: req.params.id
                }
            )
            req.flash("success", "Xóa vĩnh viễn danh mục bài viết thành công");
            res.redirect("back");
        } catch (error) {
            req.flash("error", "Xóa vĩnh viễn danh mục bài viết không thành công");
            res.redirect("back");
        }
    }
    else {
        res.send("Hack faild");
    }
}