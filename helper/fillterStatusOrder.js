module.exports = (query) => {
    let filtersStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Chờ xác nhận",
            status: "pending",
            class: ""
        },
        {
            name: "Đã xác nhận",
            status: "confirmed",
            class: ""
        },
        {
            name: "Đang đóng gói",
            status: "packing",
            class: ""
        },
        {
            name: "Đã gửi cho đơn vị vận chuyển",
            status: "shipped",
            class: ""
        },
        {
            name: "Giao hàng thành công",
            status: "delivered",
            class: ""
        },
        {
            name: "Đơn hàng hoàn tất",
            status: "completed",
            class: ""
        }
    ];

    if (query.status) {
        const index = filtersStatus.findIndex((tmp) => {
            return tmp.status == query.status;
        })
        filtersStatus[index].class = "active";
    }
    else {
        filtersStatus[0].class = "active";
    }
    return filtersStatus;
}