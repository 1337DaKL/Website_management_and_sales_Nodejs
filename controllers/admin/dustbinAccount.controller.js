const Account = require("../../models/account.model");
const searchHeper = require("../../helper/search");
const paginationHeper = require("../../helper/pagination");
const filterStatusHelper = require("../../helper/filterStatus");
module.exports.index = async (req, res) => {
    const filtersStatus = filterStatusHelper(req.query);
    let find = {
        deleted: true
    }
    if (req.query.status) {
        find.status = req.query.status;

    }
    const ojectsSearch = searchHeper(req.query);
    if (ojectsSearch.keyword) {
        find.fullName = ojectsSearch.regex;
    }
    const countOjects = await Account.countDocuments(find);
    const ojectPagination = paginationHeper(req.query, countOjects);
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else {
        sort.position = "desc";
    }
    const accounts = await Account.find(find).limit(ojectPagination.limitPage).skip(ojectPagination.skipPage).sort(sort);
    res.render("admin/pages/dustbinAccount/index",
        {
            titlePage: "Thùng rác tài khoản",
            accounts: accounts,
            filtersStatus: filtersStatus,
            keyword: ojectsSearch.keyword,
            pagination: ojectPagination
        }
    )
}
module.exports.restoreAccount = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("account_edit-dustbin")) {
        console.log(req.params.id);
        await Account.updateOne(
            {
                _id: req.params.id
            },
            {
                deleted: false
            }
        )
        req.flash("success", "Khôi phục tài khoản thành công!!");
        res.redirect("back");
    }
    else {
        res.send("Hack faild");
    }

}
module.exports.deleteAccount = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("account_edit-dustbin")) {
        const id = req.params.id;
        await Account.deleteOne({ _id: id });
        req.flash("success", "Xóa vĩnh viễn tài khoản thành công!!");
        res.redirect("back");
    }
    else {
        res.send("Hack faild");
    }

}

module.exports.changeMulti = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("account_edit-dustbin")) {
        const ids = req.body.ids.split(",");
        const type = req.body.type;
        switch (type) {
            case "restore":
                await Account.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    { deleted: false }
                )
                req.flash("success", "Khôi phục tài khoản thành công!!");
                break;
            case "delete":
                await Account.deleteMany(
                    {
                        _id: { $in: ids }
                    }
                )
                req.flash("success", "Xóa vĩnh viễn tài khoăn thành công!!");
                break;
            default:
                break;
        }
        res.redirect("back");
    }
    else {
        res.send("Hack faild");
    }

}