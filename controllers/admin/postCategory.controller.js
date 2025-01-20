const PostCategory = require("../../models/postCategory.model")
const configSystem = require("../../configs/systems");
const findTreeHelper = require("../../helper/findTreePostCategory");
const searchHelper = require("../../helper/search");
const fillterStatusHelper = require("../../helper/filterStatus");
module.exports.index = async (req, res) => {
    const fillterStatus = fillterStatusHelper(req.query);
    let find = {
        deleted: false
    }
    //Fillter status
    if (req.query.status) {
        find.status = req.query.status;
    }
    //end fillter status
    const pagination = {
        currentPage: 1,
        limitPage: 6
    }
    if (req.query.page) {
        pagination.currentPage = req.query.page;
    }
    const ojectsSearch = searchHelper(req.query);
    if (ojectsSearch.keyword) {
        find.title = ojectsSearch.regex;
    }
    const countPostCategory = await PostCategory.countDocuments();
    pagination.totalPages = Math.ceil(countPostCategory / pagination.limitPage);
    pagination.skipPage = (pagination.currentPage - 1) * pagination.limitPage;
    const postCategory = await PostCategory.find(find).limit(pagination.limitPage).skip(pagination.skipPage);
    for (let post of postCategory) {
        const arrayUpdated = post.updatedBy;
        post.lastUpdated = arrayUpdated[arrayUpdated.length - 1];
        if (post.idPostCategoryParent) {
            const postCategoryParent = await PostCategory.findOne(
                {
                    _id: post.idPostCategoryParent
                }
            )
            if (postCategoryParent) {
                post.nameParent = postCategoryParent.title;
            }
        }
    }
    res.render("admin/pages/postCategory/index.pug", {
        titlePage: "Danh mục bài viết",
        postCategory: postCategory,
        pagination: pagination,
        keyword: ojectsSearch.keyword,
        fillterStatus: fillterStatus
    })
}
module.exports.viewCreatePostCategory = async (req, res) => {
    const postCategory = await PostCategory.find({ deleted: false });
    const treePostCateory = findTreeHelper(postCategory);
    console.log(treePostCateory)
    res.render("admin/pages/postCategory/create.pug", {
        titlePage: "Tạo mới danh mục bài viết",
        treePostCateory: treePostCateory
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
            res.redirect(`${configSystem.prefixAdmin}/postCategory`);
        } catch (error) {
            req.flash("error", "Tạo danh mục bài viết không thành công");
            res.redirect("back");
        }
    }
    else {
        res.send("Hack faild");
    }
}
module.exports.changeStatus = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("post-category_edit")) {
        try {
            const id = req.params.id;
            const statusChange = req.params.status;
            const updatedBy = {
                idAccountUpdated: res.locals.userLogin.id,
                nameAccountUpdated: res.locals.userLogin.fullName,
                dateUpdated: new Date()
            }
            const oldPostCategory = await PostCategory.findOne({
                _id: id,
                deleted: false
            }).select("-slug -deleted -deletedBy -createdBy -updateted");
            await PostCategory.updateOne(
                { _id: id },
                {
                    status: statusChange
                }
            )
            const newPostCategory = await PostCategory.findOne({
                _id: id,
                deleted: false
            }).select("-slug -deleted -deletedBy -createdBy -updateted");
            await PostCategory.updateOne(
                {
                    _id: id
                },
                {
                    $push: {
                        updatedBy: {
                            ...updatedBy,
                            oldPostCategory: oldPostCategory,
                            newPostCategory: newPostCategory
                        }
                    }
                }
            )
            req.flash("success", `Thay đổi trạng thái thành ${statusChange == "active" ? "hoạt động" : "không hoạt động"} thành công!`);
            res.redirect("back");
        } catch (error) {
            req.flash("error", "Thay đổi trạng thái không thành công!");
            res.redirect("back");
        }
    }
    else {
        res.send("Hack faild");
    }
}
module.exports.viewEdit = async (req, res) => {
    const postCategory = await PostCategory.findOne(
        {
            _id: req.params.id,
            deleted: false
        }
    )
    const postCategoryAll = await PostCategory.find({
        deleted: false
    })
    const treePostCateory = findTreeHelper(postCategoryAll);
    const postCategoryParent = await PostCategory.findOne({ _id: req.params.idPostCategoryParent });
    let nameParent;
    if (postCategoryParent) {
        nameParent = postCategoryParent.title;
    }
    else {
        nameParent = "Không có danh mục cha";
    }
    res.render("admin/pages/postCategory/edit.pug", {
        titlePage: "Chỉnh sửa danh mục bài viết",
        postCategory: postCategory,
        treePostCateory: treePostCateory,
        nameParent: nameParent
    })
}
module.exports.editPostCategory = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("post-category_edit")) {
        try {
            const id = req.params.id;
            if (!req.body.title) {
                req.flash("error", "Tiêu đề không được để trống");
                res.redirect("back");
                return;
            }
            const updatedBy = {
                idAccountUpdated: res.locals.userLogin.id,
                nameAccountUpdated: res.locals.userLogin.fullName,
                dateUpdated: new Date()
            }
            const oldPostCategory = await PostCategory.findOne(
                {
                    _id: id,
                    deleted: false
                }
            ).select("-slug -deleted -deletedBy -createdBy -updatedBy");
            await PostCategory.updateOne(
                {
                    _id: id
                },
                req.body
            )
            const newPostCategory = await PostCategory.findOne(
                {
                    _id: id,
                    deleted: false
                }
            ).select("-slug -deleted -deletedBy -createdBy -updatedBy");
            await PostCategory.updateOne(
                {
                    _id: id
                },
                {
                    $push: {
                        updatedBy: {
                            ...updatedBy,
                            oldPostCategory: oldPostCategory,
                            newPostCategory: newPostCategory
                        }
                    }
                }
            )
            req.flash("success", "Chỉnh sửa danh mục bài viết thành công!!");
            res.redirect(`${configSystem.prefixAdmin}/postCategory`);
        } catch (error) {
            req.flash("error", "Chỉnh sửa danh mục bài viết thất bại!!");
            res.redirect("back");
        }
    }
    else {
        res.send("Hack faild!!");
    }
}
module.exports.deletePostCategory = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("post-category_delete")) {
        try {
            const deletedBy = {
                idAccountDeleted: res.locals.userLogin.id,
                nameAccountDeleted: res.locals.userLogin.fullName,
                dateDeleted: new Date()
            }
            await PostCategory.updateOne(
                {
                    _id: req.params.id
                },
                {
                    deleted: true,
                    deletedBy: deletedBy
                }
            )
            req.flash("success", "Xóa danh mục sản phẩm thành công");
            res.redirect("back");
        } catch (error) {
            req.flash("error", "Xóa danh mục sản phẩm không thành công");
            res.redirect("back");
        }
    }
    else {
        res.send("Hack faild");
    }
}
module.exports.viewDetel = async (req, res) => {
    const id = req.params.id;
    const postCategory = await PostCategory.findOne(
        {
            _id: id,
            deleted: false
        }
    );
    res.render("admin/pages/postCategory/detel.pug",
        {
            titlePage: "CHi tiết danh mục bài viết",
            postCategory: postCategory
        }
    )
}
module.exports.viewLogUpdated = async (req, res) => {
    const postCategory = await PostCategory.findOne(
        {
            _id: req.params.id
        }
    )
    const arrayUpdated = postCategory.updatedBy;
    res.render("admin/pages/postCategory/log.pug",
        {
            titlePage: "Lịch sử thay đổi danh mục bài viết",
            logsUpdated: arrayUpdated
        }
    )
}
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(",");
    const type = req.body.type;
    switch (type) {
        case "active":
            if (res.locals.roleLogin.permission.includes("post-category_edit")) {
                try {
                    const updatedBy = {
                        idAccountUpdated: res.locals.userLogin.id,
                        nameAccountUpdated: res.locals.userLogin.fullName,
                        dateUpdated: new Date()
                    }
                    for (const index in ids) {
                        const oldPostCategory = await PostCategory.findOne(
                            {
                                _id: ids[index]
                            }
                        ).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                        await PostCategory.updateOne(
                            {
                                _id: ids[index]
                            },
                            {
                                status: "active"
                            }
                        )
                        const newPostCategory = await PostCategory.findOne(
                            {
                                _id: ids[index]
                            }
                        ).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                        await PostCategory.updateOne(
                            {
                                _id: ids[index]
                            },
                            {
                                $push: {
                                    updatedBy: {
                                        ...updatedBy,
                                        oldPostCategory: oldPostCategory,
                                        newPostCategory: newPostCategory
                                    }
                                }
                            }
                        )
                    }
                    req.flash("success", "Thay đổi trạng thái thành công!");
                    res.redirect("back");
                } catch (error) {
                    req.flash("error", "Thay đổi trạng thái không thành công!");
                    res.redirect("back");
                }
                break;
            }
            else {
                res.send("Hack faild");
            }
        case "inactive":
            if (res.locals.roleLogin.permission.includes("post-category_edit")) {
                try {
                    const updatedBy = {
                        idAccountUpdated: res.locals.userLogin.id,
                        nameAccountUpdated: res.locals.userLogin.fullName,
                        dateUpdated: new Date()
                    }
                    for (const index in ids) {
                        const oldPostCategory = await PostCategory.findOne(
                            {
                                _id: ids[index]
                            }
                        ).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                        await PostCategory.updateOne(
                            {
                                _id: ids[index]
                            },
                            {
                                status: "inactive"
                            }
                        )
                        const newPostCategory = await PostCategory.findOne(
                            {
                                _id: ids[index]
                            }
                        ).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                        await PostCategory.updateOne(
                            {
                                _id: ids[index]
                            },
                            {
                                $push: {
                                    updatedBy: {
                                        ...updatedBy,
                                        oldPostCategory: oldPostCategory,
                                        newPostCategory: newPostCategory
                                    }
                                }
                            }
                        )
                    }
                    req.flash("success", "Thay đổi trạng thái thành công!");
                    res.redirect("back");
                } catch (error) {
                    req.flash("error", "Thay đổi trạng thái không thành công!");
                    res.redirect("back");
                }
                break;
            }
            else {
                res.send("Hack faild");
            }
        case "delete":
            if (res.locals.roleLogin.permission.includes("post-category_delete")) {
                try {
                    const deletedBy = {
                        idAccountDeleted: res.locals.userLogin.id,
                        nameAccountDeleted: res.locals.userLogin.fullName,
                        dateDeleted: new Date()
                    }
                    await PostCategory.updateMany(
                        {
                            _id: {
                                $in: ids
                            }
                        },
                        {
                            deleted: true,
                            deletedBy: deletedBy
                        }
                    )
                    req.flash("success", "Xóa danh mục bài viết thành công");
                    res.redirect("back");
                } catch (error) {
                    req.flash("error", "Xóa danh mục bài viết không thành công");
                    res.redirect("back");
                }

            }
        case "change-position":
            if (res.locals.roleLogin.permission.includes("post-category_edit")) {
                try {
                    const updatedBy = {
                        idAccountUpdated: res.locals.userLogin.id,
                        nameAccountUpdated: res.locals.userLogin.fullName,
                        dateUpdated: new Date()
                    }
                    for (const tmp of ids) {
                        const [id, position] = tmp.split("-");
                        const positionInteger = parseInt(position);
                        const oldPostCategory = await PostCategory.findOne(
                            {
                                _id: id
                            }
                        ).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                        // console.log(positionInteger)
                        await PostCategory.updateOne(
                            {
                                _id: id
                            },
                            {
                                position: positionInteger
                            }
                        )
                        const newPostCategory = await PostCategory.findOne(
                            {
                                _id: id
                            }
                        ).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                        await PostCategory.updateOne(
                            {
                                _id: id
                            },
                            {
                                $push: {
                                    updatedBy: {
                                        ...updatedBy,
                                        oldPostCategory: oldPostCategory,
                                        newPostCategory: newPostCategory
                                    }
                                }
                            }
                        )
                    }
                    req.flash("success", "Thay đổi vị trí danh mục bài viết thành công");
                    res.redirect("back");
                } catch (error) {
                    req.flash("error", "Thay đổi vị trí danh mục bài viết không thành công");
                    res.redirect("back");
                }
            }
            break;
        default:
            break;
    }
}