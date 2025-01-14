const Category = require("../../models/category.model");
const paginationHeper = require("../../helper/pagination");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHeper = require("../../helper/search");
const findTreeContro = require("../../helper/findTree")
const formatHelper = require("../../helper/formatDay");
const Account = require("../../models/account.model");
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status;

    }
    const ojectsSearch = searchHeper(req.query);
    if (ojectsSearch.keyword) {
        find.title = ojectsSearch.regex;
    }
    const filtersStatus = filterStatusHelper(req.query);
    const countOjects = await Category.countDocuments(find);
    const ojectPagination = paginationHeper(req.query, countOjects);
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else {
        sort.position = "desc";
    }
    const categorys = await Category.find(find).limit(ojectPagination.limitPage).skip(ojectPagination.skipPage).sort(sort);
    for (const tmp of categorys) {
        const idP = tmp.idParent;
        let nameParent;
        if (idP !== "") {
            const categoryParent = await Category.findOne({ _id: idP });
            nameParent = categoryParent.title;
        }
        else {
            nameParent = "";
        }
        tmp.nameParent = nameParent;
        if (tmp.createdBy.idAccountCreated) {
            const accountCreated = await Account.findOne({ _id: tmp.createdBy.idAccountCreated });
            if (accountCreated) {
                tmp.nameAccountCreated = accountCreated.fullName;
            }
        }
        const arrayUpdatedBy = tmp.updatedBy;
        if (arrayUpdatedBy.length > 0) {
            const lastUpdated = arrayUpdatedBy[arrayUpdatedBy.length - 1];
            tmp.lastUpdated = lastUpdated;
        }
    }

    res.render("admin/pages/category/index.pug", {
        categorys: categorys,
        filtersStatus: filtersStatus,
        titlePage: "Danh mục sản phẩm",
        pagination: ojectPagination,
        keyword: ojectsSearch.keyword
    })
}
module.exports.changeStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;
        const updatedBy = {
            idAccountUpdated: res.locals.userLogin.id,
            nameAccountUpdated: res.locals.userLogin.fullName,
            dateUpdated: new Date()
        };
        const oldCategory = await Category.findOne({ _id: id }).select("-deleted -deletedBy -createdBy -slug -updatedBy");
        await Category.updateOne({ _id: id }, { status: status });
        const newCategory = await Category.findOne({ _id: id }).select("-deleted -deletedBy -createdBy -slug -updatedBy");
        await Category.updateOne({ _id: id }, {
            $push: {
                updatedBy: {
                    ...updatedBy,
                    oldCategory: oldCategory,
                    newCategory: newCategory
                }
            }
        })
        req.flash("success", "Đổi trạng thái sản phẩm thành công!!");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Đổi trạng thái sản phẩm thất bại!");
        res.redirect("back");
    }
}
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(",");
    const type = req.body.type;
    switch (type) {
        case "active":
            try {
                const updatedBy = {
                    idAccountUpdated: res.locals.userLogin.id,
                    nameAccountUpdated: res.locals.userLogin.fullName,
                    dateUpdated: new Date()
                }
                for (let i = 0; i < ids.length; i++) {
                    const oldCategory = await Category.findOne({ _id: ids[i] }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                    await Category.updateOne({ _id: ids[i] }, { status: "active" });
                    const newCategory = await Category.findOne({ _id: ids[i] }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                    await Category.updateOne({ _id: ids[i] }, {
                        $push: {
                            updatedBy: {
                                ...updatedBy,
                                oldCategory: oldCategory,
                                newCategory: newCategory
                            }
                        }
                    })
                }
                req.flash("success", "Đổi trạng thái tất cả sản phẩm đã chọn thành công!!");
                break;
            } catch (error) {
                req.flash("error", "Đổi trạng thái tất cả sản phẩm đã chọn không thành công!!");
                break;
            }
        case "inactive":
            try {
                const updatedBy = {
                    idAccountUpdated: res.locals.userLogin.id,
                    nameAccountUpdated: res.locals.userLogin.fullName,
                    dateUpdated: new Date()
                }
                for (let i = 0; i < ids.length; i++) {
                    const oldCategory = await Category.findOne({ _id: ids[i] }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                    await Category.updateOne({ _id: ids[i] }, { status: "inactive" });
                    const newCategory = await Category.findOne({ _id: ids[i] }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                    await Category.updateOne({ _id: ids[i] }, {
                        $push: {
                            updatedBy: {
                                ...updatedBy,
                                oldCategory: oldCategory,
                                newCategory: newCategory
                            }
                        }
                    })
                }
                req.flash("success", "Đổi trạng thái tất cả sản phẩm đã chọn thành công!!");
                break;
            } catch (error) {
                req.flash("error", "Đổi trạng thái tất cả sản phẩm đã chọn không thành công!!");
                break;
            }
        case "delete":
            try {
                const deletedBy = {
                    idAccountDeleted: res.locals.userLogin.id,
                    nameAccountCreated: res.locals.userLogin.fullName,
                    dateDeleted: new Date()
                }
                await Category.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    {
                        $set: {
                            deleted: true,
                            deletedBy: deletedBy
                        }
                    }
                )
                req.flash("success", "Xóa sản phẩm thành công!!");
                break;
            } catch (error) {
                req.flash("error", "Xóa sản phẩm không thành công!!");
                break;
            }
        case "change-position":
            try {
                const updatedBy = {
                    idAccountUpdated: res.locals.userLogin.id,
                    nameAccountUpdated: res.locals.userLogin.fullName,
                    dateUpdated: new Date()
                }
                for (const tmp of ids) {
                    const [id, position] = tmp.split("-");
                    const parsedPosition = parseInt(position);
                    const oldCategory = await Category.findOne({ _id: id }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                    await Category.updateOne({ _id: id }, { position: parsedPosition });
                    const newCategory = await Category.findOne({ _id: id }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                    await Category.updateOne({ _id: id }, {
                        $push: {
                            updatedBy: {
                                ...updatedBy,
                                oldCategory: oldCategory,
                                newCategory: newCategory
                            }
                        }
                    })
                }
                req.flash("success", "Đổi vị trí tất cả sản phẩm đã chọn thành công!!");
                break;
            } catch (error) {
                req.flash("error", "Đổi vị trí tất cả sản phẩm đã chọn không thành công!!");
                break;
            }
    }
    res.redirect("back");
}
module.exports.createCategory = async (req, res) => {
    let find = {
        deleted: false
    }
    const category = await Category.find(find);
    const level = findTreeContro(category);
    res.render("admin/pages/category/createCategory.pug", {
        titlePage: "Tạo mới loại sản phẩm",
        levell: level
    })
}
module.exports.createNewCategory = async (req, res) => {
    try {
        if (!req.body.title) {
            req.flash("error", "Tên loại sản phẩm không được để trống!!");
            res.redirect("back");
            return;
        }
        if (!req.body.category) {
            req.body.category = "";
        }
        if (!req.body.position) {
            const count = await Category.countDocuments();
            req.body.position = count + 1;
        }
        if (!req.body.idParent) {
            req.body.idParent = "";
        }
        const createdBy = {
            idAccountCreated: res.locals.userLogin.id,
            nameAccountCreated: res.locals.userLogin.fullName
        }
        if (createdBy) {
            req.body.createdBy = createdBy
        }
        const category = new Category(req.body);
        category.save();
        req.flash("success", "Tạo mới loại sản phẩm thành công");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Tạo mới loại sản phẩm không thành công");
        res.redirect("back");
    }
}
module.exports.deleteCategory = async (req, res) => {
    try {
        const deletedBy = {
            idAccountDeleted: res.locals.userLogin.id,
            nameAccountDeleted: res.locals.userLogin.fullName,
            dateDeleted: new Date()
        }
        await Category.updateOne(
            {
                _id: req.params.id
            }
            ,
            {
                deleted: true,
                deletedBy: deletedBy
            }
        )
        req.flash("success", "Xóa sản phẩm thành công!!");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Xóa sản phẩm không thành công!!");
        res.redirect("back");
    }
}
module.exports.viewEdit = async (req, res) => {
    try {
        let find = {
            _id: req.params.id,
            deleted: false
        }

        const category = await Category.findOne(find);
        let nameParent;
        if (category.idParent) {
            const categoryParent = await Category.findOne({ _id: category.idParent });
            nameParent = categoryParent.title;
        }
        else {
            nameParent = "Không có cha";
        }
        const allCategory = await Category.find({ deleted: false });
        const treeLevel = findTreeContro(allCategory);
        res.render("admin/pages/category/editcategory.pug", {
            titlePage: "Chỉnh sửa loại sản phẩm",
            category: category,
            treeLevel: treeLevel,
            nameParent: nameParent
        })
    } catch (error) {
        res.redirect("back");
    }
}
module.exports.editCategory = async (req, res) => {
    if (!req.body.title) {
        req.flash("error", "Phải có tên của loại sản phẩm!!");
        res.redirect("back");
        return;
    }
    try {
        const updatedBy = {
            idAccountUpdated: res.locals.userLogin.id,
            nameAccountUpdated: res.locals.userLogin.fullName,
            dateUpdated: new Date()
        }
        let oldCategory = await Category.findOne({ _id: req.params.id }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
        await Category.updateOne({ _id: req.params.id }, req.body);
        let newCategory = await Category.findOne({ _id: req.params.id }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
        await Category.updateOne({ _id: req.params.id }, {
            $push: {
                updatedBy: {
                    ...updatedBy,
                    oldCategory: oldCategory,
                    newCategory: newCategory
                }
            }
        })
        req.flash("success", "Chỉnh sửa thành công");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Chỉnh sửa thất bại");
        res.redirect("back");
    }
}
module.exports.viewDetelCategory = async (req, res) => {
    const category = await Category.findOne({ _id: req.params.id });
    const createdAtNew = formatHelper.formatDate(String(category.createdAt));
    const updatedAtNew = formatHelper.formatDate(String(category.updatedAt));
    category.createdAtNew = createdAtNew;
    category.updatedAtNew = updatedAtNew;
    res.render("admin/pages/category/detelCategory.pug", {
        category: category,
        titlePage: `Chi tiết sản phẩm ${category.title}`
    })
}
module.exports.logUpdated = async (req, res) => {
    const category = await Category.findOne({
        _id: req.params.id,
        deleted: false
    })
    const logsUpdated = category.updatedBy;
    for (let log of logsUpdated) {
        if (log.oldCategory.idParent) {
            const oldParent = await Category.findOne({ _id: log.oldCategory.idParent });
            if (oldParent) {
                log.nameOldParent = oldParent.title;
            }
            else {
                log.nameOldParent = "Khong co";
            }
        }
        if (log.newCategory.idParent) {
            const newParent = await Category.findOne({ _id: log.newCategory.idParent });
            if (newParent) {
                log.nameNewParent = newParent.title;
            }
            else {
                log.nameNewParent = "Khong co";
            }
        }
    }
    res.render("admin/pages/category/logUpdated.pug", {
        titlePage: "Lịch sử thay đổi danh mục sản phẩm",
        logsUpdated: logsUpdated
    })
}

