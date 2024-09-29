const Product = require("../../models/products.model");
const priceString = require("../../helper/chuanHoaGiaHang");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHeper = require("../../helper/search");
const paginationHeper = require("../../helper/pagination");

module.exports.index = async (req , res) => {
    let find = {
        deleted : true
    }
    // pagination
    const countOjects = await Product.countDocuments(find);
    const ojectPagination = paginationHeper(req.query , countOjects);
    // end pagination
    //search
    const searchDustbin = searchHeper(req.query);
    if(searchDustbin.keyword)
    {
        find.title = searchDustbin.regex;
    }
    //end search
    const products = await Product.find(find).limit(ojectPagination.limitPage).skip(ojectPagination.skipPage);;
    res.render("admin/pages/dustbin/index.pug" , {
        titlePage : "Thùng rác",
        products : products,
        keyword: searchDustbin.keyword,
        pagination: ojectPagination
    })
}
module.exports.restoreProduct =  async(req , res) => {
    const id = req.params.id;
    await Product.updateOne({_id : id} , {deleted : false});
    req.flash("success" , "Khôi phục sản phẩm thành công!!");
    res.redirect("back");
}
module.exports.deleteProduct = async(req , res) => {
    const id = req.params.id;
    await Product.deleteOne({_id : id});
    req.flash("success" , "Xóa sản phẩm thành công!!");
    res.redirect("back");
}

module.exports.changeMulti = async (req , res) => {
    const ids = req.body.ids.split(",");
    const type = req.body.type;
    switch (type)
    {
        case "restore":
            await Product.updateMany(
                {
                    _id : {$in : ids}
                },
                {deleted : false}
            )
            req.flash("success" , "Khôi phục sản phẩm thành công!!");
            break;
        case "delete" :
            await Product.deleteMany(
                {
                    _id : {$in : ids}
                }
            )
            req.flash("success" , "Xóa sản phẩm thành công!!");
            break;
        default:
            break;
    }
    res.redirect("back");
}

