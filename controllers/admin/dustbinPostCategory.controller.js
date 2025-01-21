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
    const pagination = {
        currentPage: 1,
        limitPage: 4
    }
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    const countPostCategory = await PostCategory.countDocuments();
    pagination.totalPages = Math.ceil(countPostCategory / pagination.limitPage - 1);
    pagination.skipPage = (pagination.currentPage - 1) * pagination.limitPage;
    const postCategory = await PostCategory.find(find).limit(pagination.limitPage).skip(pagination.skipPage);
    res.render("admin/pages/dustbinPostCategory/index.pug", {
        titlePage: "Thùng rác danh mục bài viết",
        postCategory: postCategory,
        keyword: searchObject.keyword,
        pagination: pagination
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

module.exports.changeMulti = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("post-category_edit-dustbin")) {
        const ids = req.body.ids.split(",");
        const type = req.body.type;
        switch (type) {
            case "restore":
                try {
                    await PostCategory.updateMany(
                        {
                            _id: {
                                $in: ids
                            }
                        },
                        {
                            deleted: false
                        }
                    )
                    req.flash("success", "Khôi phục danh mục bài viết thành công!!");
                    res.redirect("back");
                } catch (error) {
                    req.flash("error", "Khôi phục danh mục bài viết không thành công!!");
                    res.redirect("back");
                }
                break;
            case "delete":
                try {
                    await PostCategory.deleteMany(
                        {
                            _id: {
                                $in: ids
                            }
                        }
                    )
                    req.flash("success", "Xóa VĨNH VIỄN danh mục bài viết thành công!!");
                    res.redirect("back");
                } catch (error) {
                    req.flash("error", "Xóa VĨNH VIỄN danh mục bài viết không thành công!!");
                    res.redirect("back");
                }
            default:
                break;
        }
    }
    else {
        res.send("Hack faild");
    }
}