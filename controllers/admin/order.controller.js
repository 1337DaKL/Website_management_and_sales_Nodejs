const Order = require("../../models/order.model");
const User = require("../../models/user.model");
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
    }
    res.render("admin/pages/order/index.pug", {
        orders: orders,
        titlePage: "Quản lí đơn hàng",
        pagination: objectPagination
    })
}