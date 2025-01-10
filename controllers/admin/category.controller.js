const Category = require("../../models/category.model");
const paginationHeper = require("../../helper/pagination");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHeper = require("../../helper/search");
const findTreeContro = require("../../helper/findTree")
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

    const categoryss = [];
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
        categoryss.push(tmp);
    }

    res.render("admin/pages/category/index.pug", {
        categorys: categoryss,
        filtersStatus: filtersStatus,
        titlePage: "Danh mục sản phẩm",
        pagination: ojectPagination,
        keyword: ojectsSearch.keyword
    })
}
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Category.updateOne({ _id: id }, { status: status });
    req.flash("success", "Đổi trạng thái sản phẩm thành công!!");
    res.redirect("back");
}

module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(",");
    const type = req.body.type;
    switch (type) {
        case "active":
            await Category.updateMany(
                {
                    _id: { $in: ids }
                },
                { status: "active" }
            )
            req.flash("success", "Đổi trạng thái tất cả sản phẩm đã chọn thành công!!");
            break;
        case "inactive":
            await Category.updateMany(
                {
                    _id: { $in: ids }
                },
                { status: "inactive" }
            )
            req.flash("success", "Đổi trạng thái tất cả sản phẩm đã chọn thành công!!");
            break;
        case "delete":
            await Category.updateMany(
                {
                    _id: { $in: ids }
                },
                {
                    $set: {
                        deleted: true,
                        dateDeleted: new Date()
                    }
                }
            )
            req.flash("success", "Xóa sản phẩm thành công!!");
            break;
        case "change-position":
        case "change-position":
            for (const tmp of ids) {
                const [id, position] = tmp.split("-");
                const parsedPosition = parseInt(position);
                await Category.updateOne({ _id: id }, { position: parsedPosition });
            }
            req.flash("success", "Đổi vị trí tất cả sản phẩm đã chọn thành công!!");
            break;
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
    const category = new Category(req.body);
    category.save();
    req.flash("success", "Tạo mới loại sản phẩm thành công");
    res.redirect("back");
}
module.exports.deleteCategory = async (req, res) => {
    await Category.deleteOne(
        {
            _id: req.params.id
        }
    )
    req.flash("success", "Xóa sản phẩm thành công!!");
    res.redirect("back");
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
        await Category.updateOne({ _id: req.params.id }, req.body);
        req.flash("success", "Chỉnh sửa thành công");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Chỉnh sửa thất bại");
        res.redirect("back");
    }
}
module.exports.viewDetelCategory = async (req, res) => {
    const category = await Category.findOne({ _id: req.params.id });
    res.render("admin/pages/category/detelCategory.pug", {
        category: category,
        titlePage: `Chi tiết sản phẩm ${category.title}`
    })
}

