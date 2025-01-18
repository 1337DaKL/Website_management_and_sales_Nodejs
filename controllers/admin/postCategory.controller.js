const PostCategory = require("../../models/postCategory.model");
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const pagination = {
        currentPage: 1,
        limitPage: 6
    }
    if (req.query.page) {
        pagination.currentPage = req.query.page;
    }
    const countPostCategory = await PostCategory.countDocuments();
    pagination.totalPages = Math.ceil(countPostCategory / pagination.limitPage);
    pagination.skipPage = (pagination.currentPage - 1) * pagination.limitPage;
    const postCategory = await PostCategory.find(find).limit(pagination.limitPage).skip(pagination.skipPage);
    res.render("admin/pages/postCategory/index.pug", {
        titlePage: "Danh mục bài viết",
        postCategory: postCategory,
        pagination: pagination
    })
}
module.exports.viewCreatePostCategory = (req, res) => {
    res.render("admin/pages/postCategory/create.pug", {
        titlePage: "Tạo mới danh mục bài viết"
    })
}
module.exports.createPostCategory = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("post-category_create")) {
        try {
            if (!req.body.title) {
                req.flash("error", "Tiêu đề không được bỏ trống");
                res.redirect("back");
            }
            if (!req.body.position) {
                const countPostCategory = await PostCategory.countDocuments();
                req.body.position = countPostCategory + 1;
            }
            const createdBy = {
                idAccountCreated: res.locals.userLogin.id,
                nameAccountCreated: res.locals.userLogin.fullName,
            }
            if (createdBy) {
                req.body.createdBy = createdBy;
            }
            const postCategory = new PostCategory(req.body)
            await postCategory.save();
            req.flash("success", "Tạo danh mục bài viết thành công!!");
            res.redirect("back");
        } catch (error) {
            req.flash("error", "Tạo danh mục bài viết không thành công");
            res.redirect("back");
        }
    }
    else {
        res.send("Hack faild");
    }
}