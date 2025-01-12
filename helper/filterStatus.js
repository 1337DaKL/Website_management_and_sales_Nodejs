module.exports = (query) => {
    let filtersStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Không hoạt động",
            status: "inactive",
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