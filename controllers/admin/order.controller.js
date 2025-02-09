const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const searchHelper = require("../../helper/search");
const filterStatusHelper = require("../../helper/fillterStatusOrder");
const priceHelper = require("../../helper/chuanHoaGiaHang");
const Product = require("../../models/products.model");
const transcript = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    packing: "Đang đóng gói",
    shipped: "Đã gửi cho đơn vị vận chuyển",
    delivered: "Giao hàng thành công",
    completed: "Đơn hàng hoàn tất"
}
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    //fillter status
    const filtersStatus = filterStatusHelper(req.query);
    if (req.query.status) {
        find.status = req.query.status;

    }
    //end fillter status
    //Phân trang
    let objectPagination = {
        limitPage: 8,
        currentPage: 1
    }
    const page = req.query.page;
    if (page) {
        objectPagination.currentPage = parseInt(page);
    }
    const countOrders = await Order.countDocuments();
    objectPagination.totalPages = Math.ceil(countOrders / objectPagination.limitPage);
    objectPagination.skipPage = (objectPagination.currentPage - 1) * objectPagination.limitPage;
    // End phân trang
    //search
    let objectSearch;
    let keyword = "";
    if (req.query.keyword) {
        objectSearch = searchHelper(req.query);
        find["userInfor.fullName"] = objectSearch.regex;
        keyword = objectSearch.keyword;
    }
    //End search 
    const orders = await Order.find(find).skip(objectPagination.skipPage).limit(objectPagination.limitPage);
    for (let order of orders) {
        const idUser = order.user_id;
        const user = await User.findOne({
            _id: idUser,
            deleted: false
        }).select("fullName email telephone");
        if (user) {
            order.user = user;
        }
        order.statusTranscripted = transcript[order.status];
        //last updated
        const lastUpdated = order.updatedBy[order.updatedBy.length - 1];
        order.lastUpdated = lastUpdated;
        //end last updated
    }
    res.render("admin/pages/order/index.pug", {
        orders: orders,
        titlePage: "Quản lí đơn hàng",
        pagination: objectPagination,
        keyword: keyword,
        filtersStatus: filtersStatus,
    })
}
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(",");
    const type = req.body.type;
    try {
        switch (type) {
            case "pending":
                if (res.locals.roleLogin.permission.includes("order_edit")) {
                    let updatedBy = {
                        idAccountUpdated: res.locals.userLogin.id,
                        nameAccountUpdated: res.locals.userLogin.fullName,
                        dateUpdated: new Date()
                    }
                    for (let id of ids) {
                        const oldOrder = await Order.findOne(
                            {
                                deleted: false,
                                _id: id
                            }
                        ).select("userInfor products status");
                        await Order.updateOne(
                            {
                                _id: id,
                                deleted: false
                            },
                            {
                                status: type
                            }
                        )
                        const newOrder = await Order.findOne(
                            {
                                deleted: false,
                                _id: id
                            }
                        ).select("userInfor products status");
                        await Order.updateOne(
                            {
                                _id: id,
                                deleted: false
                            },
                            {
                                $push: {
                                    updatedBy: {
                                        ...updatedBy,
                                        oldOrder: oldOrder,
                                        newOrder: newOrder
                                    }
                                }
                            }
                        )
                    }
                    req.flash("success", `Đổi trạng thái sản phẩm đã chọn thành ${transcript[type]} thành công!`);
                    res.redirect("back");
                }
                else {
                    res.send("Hack faild");
                }
                break;
            case "confirmed":
                if (res.locals.roleLogin.permission.includes("order_edit")) {
                    let updatedBy = {
                        idAccountUpdated: res.locals.userLogin.id,
                        nameAccountUpdated: res.locals.userLogin.fullName,
                        dateUpdated: new Date()
                    }
                    for (let id of ids) {
                        const oldOrder = await Order.findOne(
                            {
                                deleted: false,
                                _id: id
                            }
                        ).select("userInfor products status");
                        await Order.updateOne(
                            {
                                _id: id,
                                deleted: false
                            },
                            {
                                status: type
                            }
                        )
                        const newOrder = await Order.findOne(
                            {
                                deleted: false,
                                _id: id
                            }
                        ).select("userInfor products status");
                        await Order.updateOne(
                            {
                                _id: id,
                                deleted: false
                            },
                            {
                                $push: {
                                    updatedBy: {
                                        ...updatedBy,
                                        oldOrder: oldOrder,
                                        newOrder: newOrder
                                    }
                                }
                            }
                        )
                    }
                    req.flash("success", `Đổi trạng thái sản phẩm đã chọn thành ${transcript[type]} thành công!`);
                    res.redirect("back");
                }
                else {
                    res.send("Hack faild");
                }
                break;
            case "packing":
                if (res.locals.roleLogin.permission.includes("order_edit")) {
                    let updatedBy = {
                        idAccountUpdated: res.locals.userLogin.id,
                        nameAccountUpdated: res.locals.userLogin.fullName,
                        dateUpdated: new Date()
                    }
                    for (let id of ids) {
                        const oldOrder = await Order.findOne(
                            {
                                deleted: false,
                                _id: id
                            }
                        ).select("userInfor products status");
                        await Order.updateOne(
                            {
                                _id: id,
                                deleted: false
                            },
                            {
                                status: type
                            }
                        )
                        const newOrder = await Order.findOne(
                            {
                                deleted: false,
                                _id: id
                            }
                        ).select("userInfor products status");
                        await Order.updateOne(
                            {
                                _id: id,
                                deleted: false
                            },
                            {
                                $push: {
                                    updatedBy: {
                                        ...updatedBy,
                                        oldOrder: oldOrder,
                                        newOrder: newOrder
                                    }
                                }
                            }
                        )
                    }
                    req.flash("success", `Đổi trạng thái sản phẩm đã chọn thành ${transcript[type]} thành công!`);
                    res.redirect("back");
                }
                else {
                    res.send("Hack faild");
                }
                break;
            case "shipped":
                if (res.locals.roleLogin.permission.includes("order_edit")) {
                    let updatedBy = {
                        idAccountUpdated: res.locals.userLogin.id,
                        nameAccountUpdated: res.locals.userLogin.fullName,
                        dateUpdated: new Date()
                    }
                    for (let id of ids) {
                        const oldOrder = await Order.findOne(
                            {
                                deleted: false,
                                _id: id
                            }
                        ).select("userInfor products status");
                        await Order.updateOne(
                            {
                                _id: id,
                                deleted: false
                            },
                            {
                                status: type
                            }
                        )
                        const newOrder = await Order.findOne(
                            {
                                deleted: false,
                                _id: id
                            }
                        ).select("userInfor products status");
                        await Order.updateOne(
                            {
                                _id: id,
                                deleted: false
                            },
                            {
                                $push: {
                                    updatedBy: {
                                        ...updatedBy,
                                        oldOrder: oldOrder,
                                        newOrder: newOrder
                                    }
                                }
                            }
                        )
                    }
                    req.flash("success", `Đổi trạng thái sản phẩm đã chọn thành ${transcript[type]} thành công!`);
                    res.redirect("back");
                }
                else {
                    res.send("Hack faild");
                }
                break;
            case "delivered":
                if (res.locals.roleLogin.permission.includes("order_edit")) {
                    let updatedBy = {
                        idAccountUpdated: res.locals.userLogin.id,
                        nameAccountUpdated: res.locals.userLogin.fullName,
                        dateUpdated: new Date()
                    }
                    for (let id of ids) {
                        const oldOrder = await Order.findOne(
                            {
                                deleted: false,
                                _id: id
                            }
                        ).select("userInfor products status");
                        await Order.updateOne(
                            {
                                _id: id,
                                deleted: false
                            },
                            {
                                status: type
                            }
                        )
                        const newOrder = await Order.findOne(
                            {
                                deleted: false,
                                _id: id
                            }
                        ).select("userInfor products status");
                        await Order.updateOne(
                            {
                                _id: id,
                                deleted: false
                            },
                            {
                                $push: {
                                    updatedBy: {
                                        ...updatedBy,
                                        oldOrder: oldOrder,
                                        newOrder: newOrder
                                    }
                                }
                            }
                        )
                    }
                    req.flash("success", `Đổi trạng thái sản phẩm đã chọn thành ${transcript[type]} thành công!`);
                    res.redirect("back");
                }
                else {
                    res.send("Hack faild");
                }
                break;
            case "completed":
                if (res.locals.roleLogin.permission.includes("order_edit")) {
                    let updatedBy = {
                        idAccountUpdated: res.locals.userLogin.id,
                        nameAccountUpdated: res.locals.userLogin.fullName,
                        dateUpdated: new Date()
                    }
                    for (let id of ids) {
                        const oldOrder = await Order.findOne(
                            {
                                deleted: false,
                                _id: id
                            }
                        ).select("userInfor products status");
                        await Order.updateOne(
                            {
                                _id: id,
                                deleted: false
                            },
                            {
                                status: type
                            }
                        )
                        const newOrder = await Order.findOne(
                            {
                                deleted: false,
                                _id: id
                            }
                        ).select("userInfor products status");
                        await Order.updateOne(
                            {
                                _id: id,
                                deleted: false
                            },
                            {
                                $push: {
                                    updatedBy: {
                                        ...updatedBy,
                                        oldOrder: oldOrder,
                                        newOrder: newOrder
                                    }
                                }
                            }
                        )
                    }
                    req.flash("success", `Đổi trạng thái sản phẩm đã chọn thành ${transcript[type]} thành công!`);
                    res.redirect("back");
                }
                else {
                    res.send("Hack faild");
                }
                break;
            case "delete":
                const deletedBy = {
                    idAccountDeleted: res.locals.userLogin.id,
                    nameAccountDeleted: res.locals.userLogin.fullName,
                    dateDeleted: new Date()
                }
                await Order.updateMany(
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
                req.flash("success", "Xóa tất cả đơn hàng đã chọn thành công");
                res.redirect("back");
                break;
            default:
                break;
        }
    } catch (error) {
        req.flash("error", `Thực hiện hành động đã chọn không thành công!`);
        res.redirect("back");
    }
}
module.exports.deleteOrder = async (req, res) => {
    const id = req.params.id;
    const deletedBy = {
        idAccountDeleted: res.locals.userLogin.id,
        nameAccountDeleted: res.locals.userLogin.fullName,
        dateDeleted: new Date()
    }
    try {
        await Order.updateOne(
            {
                _id: id
            },
            {
                deleted: true,
                deletedBy: deletedBy
            }
        )
        req.flash("success", "Xóa đơn hàng thành công!");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Xóa đơn hàng không thành công!");
        res.redirect("back");
    }
}
module.exports.detelOrder = async (req, res) => {
    const order = await Order.findOne(
        {
            _id: req.params.id,
            deleted: false
        }
    );
    const user = await User.findOne(
        {
            _id: order.user_id,
            deleted: false
        }
    ).select("fullName email")
    if (user) {
        order.user = user;
    }
    order.statusTranscripted = transcript[order.status];
    if (order.products.length > 0) {
        for (let product of order.products) {
            product.totalPrice = product.price * product.quantity;
            product.priceString = priceHelper(product.price);
            product.totalPriceString = priceHelper(product.totalPrice);
            const productDetail = await Product.findOne(
                {
                    _id: product.product_id,
                    deleted: false
                }
            ).select("thumbnail title");
            if (productDetail) {
                product.productDetail = productDetail;
            }
        }
    }
    const totalOrder = order.products.reduce((total, product) => {
        return total + product.totalPrice;
    }, 0);
    order.totalOrderString = priceHelper(totalOrder);
    res.render("admin/pages/order/detel.pug", {
        titlePage: "Chi tiết đơn hàng",
        order: order
    })
}
module.exports.viewEditOrder = async (req, res) => {
    const order = await Order.findOne(
        {
            _id: req.params.id,
            deleted: false
        }
    );
    order.statusTranscripted = transcript[order.status];
    if (order.products.length > 0) {
        for (let product of order.products) {
            product.totalPrice = product.price * product.quantity;
            product.priceString = priceHelper(product.price);
            product.totalPriceString = priceHelper(product.totalPrice);
            const productDetail = await Product.findOne(
                {
                    _id: product.product_id,
                    deleted: false
                }
            ).select("thumbnail title stock id");
            if (productDetail) {
                product.productDetail = productDetail;
            }
        }
    }
    const totalOrder = order.products.reduce((total, product) => {
        return total + product.totalPrice;
    }, 0);
    order.totalOrderString = priceHelper(totalOrder);
    res.render("admin/pages/order/edit.pug", {
        titlePage: "Chỉnh sửa đơn hàng",
        order: order
    })
}
module.exports.updateInforUser = async (req , res) => {
    if(res.locals.roleLogin.permission.includes("order_edit")) {
        try {
            const updatedBy = {
                idAccountUpdated : res.locals.userLogin.id,
                nameAccountUpdated : res.locals.userLogin.fullName,
                dateUpdated : new Date()
            }
            console.log(req.body);
            res.send("ok");
            // const oldOrder = await Order.findOne(
            //     {
            //         _id : req.params.id,
            //         deleted : false
            //     }
            // ).select("userInfor products status");
            // await Order.updateOne(
            //     {
            //         _id : req.params.id,
            //         deleted : false
            //     },
            //     {
            //         userInfor : req.body
            //     }
            // )
            // const newOrder = await Order.findOne(
            //     {
            //         _id : req.params.id,
            //         deleted : false
            //     }
            // ).select("userInfor products status");
            // await Order.updateOne(
            //     {
            //         _id : req.param.id,
            //         deleted : false
            //     },
            //     {
            //         $push: {
            //             updatedBy : {
            //                 ...updatedBy ,
            //                 oldOrder : oldOrder,
            //                 newOrder : newOrder
            //             }
            //         }
            //     }
            // )
            // req.flash("success" , "Bạn đã cập nhật thông tin người nhận hàng thành công!!");
            // res.redirect("back");
        } catch (error) {
            req.flash("error" , "Bạn cập nhật thông tin người nhận hàng không thành công!!");
            res.redirect("back");
        }
    }
    else {
        res.send("Hack faild");
    }
}