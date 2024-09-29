module.exports  = (query) => {
    let filtersStatus = [
        {
            name: "Tat ca",
            status: "",
            class: ""
        },
        {
            name: "Hoat dong",
            status: "active",
            class: ""
        },
        {
            name: "Khong hoat dong",
            status: "inactive",
            class: ""
        }
    ];

    if(query.status)
    {
        const index = filtersStatus.findIndex((tmp ) => {
            return tmp.status == query.status;
        })
        filtersStatus[index].class = "active";
    }
    else
    {
        filtersStatus[0].class = "active";
    }
    return filtersStatus;
}