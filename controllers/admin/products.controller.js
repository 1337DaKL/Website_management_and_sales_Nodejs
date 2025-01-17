const Product = require("../../models/products.model")
const priceString = require("../../helper/chuanHoaGiaHang");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHeper = require("../../helper/search");
const paginationHeper = require("../../helper/pagination");
const { model } = require("mongoose");
const Category = require("../../models/category.model");
const findTreeContro = require("../../helper/findTree");
const formatHelper = require("../../helper/formatDay");
const Account = require("../../models/account.model");
module.exports.index = async (req, res) => {
    //Filter status
    const filtersStatus = filterStatusHelper(req.query);
    // End filter status
    let find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status;

    }
    //Search
    const ojectsSearch = searchHeper(req.query);
    if (ojectsSearch.keyword) {
        find.title = ojectsSearch.regex;
    }
    //End Search

    //Pagination
    const countOjects = await Product.countDocuments(find);
    const ojectPagination = paginationHeper(req.query, countOjects);
    //End Pagination
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else {
        sort.position = "desc";
    }
    const products = await Product.find(find).limit(ojectPagination.limitPage).skip(ojectPagination.skipPage).sort(sort);

    //Chuan hoa lai price
    for (let tmp of products) {
        tmp.priceString = priceString(tmp.price);
        const accountCreated = await Account.findOne({
            _id: tmp.createdBy.idAccountCreated
        })
        if (accountCreated) {
            tmp.nameCreated = accountCreated.fullName
        }
        if (tmp.updatedBy.length > 0) {
            const lastUpdated = tmp.updatedBy[tmp.updatedBy.length - 1];
            if (lastUpdated) {
                tmp.nameAccountUpdated = lastUpdated.nameAccountUpdated;
                tmp.timeLastUpdated = lastUpdated.dateUpdated;
            }
        }
    };
    //End Chuan hoa lai price

    res.render("admin/pages/products/index.pug", {
        titlePage: "Trang san pham admin",
        products: products,
        filtersStatus: filtersStatus,
        keyword: ojectsSearch.keyword,
        pagination: ojectPagination
    })
}
module.exports.changeStatus = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("products_edit")) {
        const status = req.params.status;
        const id = req.params.id;
        const oldProduct = await Product.findOne({ _id: id }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
        const updatedBy = {
            idAccountUpdated: res.locals.userLogin.id,
            nameAccountUpdated: res.locals.userLogin.fullName,
            dateUpdated: new Date(),
            oldProduct: oldProduct,
        }
        await Product.updateOne({ _id: id }, { status: status });
        const newProduct = await Product.findOne({ _id: id }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
        updatedBy.newProduct = newProduct;
        await Product.updateOne({ _id: id }, {
            $push: {
                updatedBy: updatedBy
            }
        });
        req.flash("success", "Đổi trạng thái sản phẩm thành công!!");
        res.redirect("back");
    }
    else {
        res.send("Hack faild");
    }

}

module.exports.changeMulti = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("products_edit")) {
        const ids = req.body.ids.split(",");
        const type = req.body.type;
        const updatedBy = {
            idAccountUpdated: res.locals.userLogin.id,
            nameAccountUpdated: res.locals.userLogin.fullName,
            dateUpdated: new Date()
        }
        switch (type) {
            case "active":
                try {
                    for (let i = 0; i < ids.length; i++) {
                        const id = ids[i];
                        const oldProduct = await Product.findOne({ _id: id }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                        await Product.updateOne({ _id: id }, { status: "active" });
                        const newProduct = await Product.findOne({ _id: id }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                        await Product.updateOne({ _id: id }, {
                            $push: {
                                updatedBy: {
                                    ...updatedBy,
                                    oldProduct: oldProduct,
                                    newProduct: newProduct
                                }
                            }
                        });
                    }
                    req.flash("success", "Đổi trạng thái tất cả sản phẩm đã chọn thành công!!");
                    break;
                } catch (error) {
                    req.flash("error", "Đổi trạng thái tất cả sản phẩm đã chọn thất bại!!");
                    break;
                }
            case "inactive":
                try {
                    for (let i = 0; i < ids.length; i++) {
                        const id = ids[i];
                        const oldProduct = await Product.findOne({ _id: id }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                        await Product.updateOne({ _id: id }, { status: "inactive" });
                        const newProduct = await Product.findOne({ _id: id }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                        await Product.updateOne({ _id: id }, {
                            $push: {
                                updatedBy: {
                                    ...updatedBy,
                                    oldProduct: oldProduct,
                                    newProduct: newProduct
                                }
                            }
                        });
                    }
                    req.flash("success", "Đổi trạng thái tất cả sản phẩm đã chọn thành công!!");
                    break;
                } catch (error) {
                    req.flash("error", "Đổi trạng thái tất cả sản phẩm đã chọn thất bại!!");
                    break;
                }
            case "delete":
                try {
                    const deletedBy = {
                        idAccountDeleted: res.locals.userLogin.id,
                        dateDeleted: new Date()
                    }
                    await Product.updateMany(
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
                    req.flash("success", "Xóa tất cả sản phẩm thành công!!");
                    break;
                } catch (error) {
                    req.flash("error", "Xóa tất cả sản phẩm thất bại!!");
                    break;
                }
            case "change-position":
                try {
                    for (const tmp of ids) {
                        const [id, position] = tmp.split("-");
                        const parsedPosition = parseInt(position);
                        const oldProduct = await Product.findOne({ _id: id }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                        await Product.updateOne({ _id: id }, { position: parsedPosition });
                        const newProduct = await Product.findOne({ _id: id }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
                        await Product.updateOne({ _id: id }, {
                            $push: {
                                updatedBy: {
                                    ...updatedBy,
                                    oldProduct: oldProduct,
                                    newProduct: newProduct
                                }
                            }
                        });
                    }
                    req.flash("success", "Đổi vị trí tất cả sản phẩm đã chọn thành công!!");
                    break;
                } catch (error) {
                    req.flash("error", "Đổi vị trí tất cả sản phẩm đã chọn thất bại!!");
                    break;
                }
        }
        res.redirect("back");
    }
    else {
        res.send("Hack faild");
    }

}

module.exports.deleteProduct = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("products_delete")) {
        const id = req.params.id;
        const deletedBy = {
            idAccountDeleted: res.locals.userLogin.id,
            nameAccountCreated: res.locals.userLogin.fullName,
            dateDeleted: new Date()
        }
        await Product.updateOne({ _id: id }, { $set: { deleted: true, deletedBy: deletedBy } });
        req.flash("success", "Xóa sản phẩm thành công!!");
        res.redirect("back");
    }
    else {
        res.send("Hack faild");
    }

}

module.exports.create = async (req, res) => {
    const category = await Category.find({ deleted: false });
    const level = findTreeContro(category);
    res.render("admin/pages/products/create.pug", {
        titlePage: "Trang tạo mới sản phẩm",
        levell: level
    })
}

module.exports.createNewProduct = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("products_create")) {
        if (!req.body.title) {
            req.flash("error", "Sản phẩm bạn tạo bắt buộc phải có tên sản phẩm !!")
            res.redirect("back");
            return;
        }
        if (req.body.discount != "") {
            req.body.discount = parseInt(req.body.discount);
        }
        if (req.body.price != "") {
            req.body.price = parseInt(req.body.price + "000");
        }
        if (req.body.stock) {
            req.body.stock = parseInt(req.body.stock);
        }
        if (req.body.position == "") {
            const countProducts = await Product.countDocuments();
            req.body.position = countProducts + 1;
        }
        else {
            req.body.position = parseInt(req.body.position);
        }
        const createdBy = {
            idAccountCreated: res.locals.userLogin.id,
            nameAccountCreated: res.locals.userLogin.fullName
        }
        if (createdBy) {
            req.body.createdBy = createdBy
        }
        const product = new Product(req.body);
        await product.save();
        req.flash("success", "Tạo mới sản phẩm thành công!!");
        res.redirect("back");
    }
    else {
        res.send("Hack faild");
    }

}


module.exports.editProduct = async (req, res) => {
    try {
        const category = await Category.find({ deleted: false });
        const level = findTreeContro(category);
        let find = {
            _id: req.params.id,
            deleted: false
        }
        const productID = await Product.findOne(find);
        if (productID.price) {
            productID.price = productID.price.toString().substring(0, productID.price.toString().length - 3);
        }
        const cate = await Category.findOne({ _id: productID.category });
        res.render("admin/pages/products/edit.pug", {
            titlePage: "Chỉnh sửa sản phẩm",
            product: productID,
            levell: level,
            cate: cate
        })
    } catch (error) {
        res.redirect("back");
    }
}

module.exports.editProductInDatabase = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("products_edit")) {
        if (!req.body.title) {
            req.flash("error", "Sản phẩm bắt buộc phải có tên sản phẩm !!")
            res.redirect("back");
            return;
        }
        if (req.body.discount != "") {
            req.body.discount = parseInt(req.body.discount);
        }
        if (req.body.price != "") {
            req.body.price = parseInt(req.body.price + "000");
        }
        if (req.body.stock) {
            req.body.stock = parseInt(req.body.stock);
        }
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        }
        try {
            const updatedBy = {
                idAccountUpdated: res.locals.userLogin.id,
                nameAccountUpdated: res.locals.userLogin.fullName,
                dateUpdated: new Date(),
            }
            const oldProduct = await Product.findOne({ _id: req.params.id }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
            await Product.updateOne({ _id: req.params.id }, req.body);
            const newProduct = await Product.findOne({ _id: req.params.id }).select("-slug -deleted -deletedBy -createdBy -updatedBy");
            await Product.updateOne({ _id: req.params.id }, {
                $push: {
                    updatedBy: {
                        ...updatedBy,
                        oldProduct: oldProduct,
                        newProduct: newProduct
                    }
                }
            });
            req.flash("success", "Chỉnh sửa sản phẩm thành công!!");
            res.redirect("back");
        } catch (error) {
            req.flash("error", "Chỉnh sửa sản phẩm thất bại!!");
            res.redirect("back");
        }
    }
    else {
        res.send("Hack faild");
    }

}

module.exports.detelProduct = async (req, res) => {
    try {
        let find = {
            _id: req.params.id,
            deleted: false
        }
        let productDetel = await Product.findOne(find);
        if (productDetel.price) {
            productDetel.priceString = priceString(productDetel.price);
        }
        res.render("admin/pages/products/detel.pug", {
            title: `Chi tiết sản phầm ${productDetel.title}`,
            product: productDetel
        })
    }
    catch (error) {
        req.flash("error", "Lỗi lấy dữ liệu");
        res.redirect("back");
    }
}

module.exports.logUpdateProduct = async (req, res) => {
    const product = await Product.findOne({
        _id: req.params.id,
        deleted: false
    })
    for (let tmp of product.updatedBy) {
        if (tmp.oldProduct.category != "") {
            const oldNameCategory = await Category.findOne({ _id: tmp.oldProduct.category });
            tmp.oldNameCategory = oldNameCategory.title;
        }
        else {
            tmp.oldNameCategory = "Không có";
        }
        if (tmp.newProduct.category != "") {
            const newNameCategory = await Category.findOne({ _id: tmp.newProduct.category });
            tmp.newNameCategory = newNameCategory.title;
        }
        else {
            tmp.newNameCategory = "Không có";
        }
    }
    const updatedBy = product.updatedBy;
    res.render("admin/pages/products/log.pug", {
        titlePage: "Lịch sử thay đổi sản phẩm",
        updatedBy: updatedBy
    })
}