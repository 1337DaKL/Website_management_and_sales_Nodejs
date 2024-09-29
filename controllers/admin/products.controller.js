const Product = require("../../models/products.model")
const priceString = require("../../helper/chuanHoaGiaHang");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHeper = require("../../helper/search");
const paginationHeper = require("../../helper/pagination");
module.exports.index = async (req , res) => {
    //Filter status
    const filtersStatus = filterStatusHelper(req.query);
    // End filter status
    let find = {
        deleted: false
    }
    if(req.query.status)
    {
        find.status = req.query.status;

    }
    //Search
    const ojectsSearch = searchHeper(req.query);
    if(ojectsSearch.keyword)
    {
        find.title = ojectsSearch.regex;
    }
    //End Search
    
    //Pagination
    const countOjects = await Product.countDocuments(find);
    const ojectPagination = paginationHeper(req.query , countOjects);
    //End Pagination

    const products = await Product.find(find).limit(ojectPagination.limitPage).skip(ojectPagination.skipPage).sort({position:"desc"});

    //Chuan hoa lai price
    const newProducts = products.map((tmp) => {
        tmp.priceString = priceString(tmp.price);
        return tmp;
    })
    //End Chuan hoa lai price
    res.render("admin/pages/products/index.pug" , {
        titlePage : "Trang san pham admin",
        products: newProducts,
        filtersStatus :filtersStatus,
        keyword: ojectsSearch.keyword,
        pagination: ojectPagination
    })
}
module.exports.changeStatus = async (req , res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({_id : id} , {status : status});
    req.flash("success" , "Đổi trạng thái sản phẩm thành công!!");
    res.redirect("back");
}

module.exports.changeMulti = async (req , res) => { 
    const ids = req.body.ids.split(",");
    const type = req.body.type;
    switch (type)
    {
        case "active" :
            await Product.updateMany(
                {
                    _id : {$in : ids}
                },
                {status : "active"}
            )
            req.flash("success" , "Đổi trạng thái tất cả sản phẩm đã chọn thành công!!");
            break;
        case "inactive" :
            await Product.updateMany(
                {
                    _id : {$in : ids}
                },
                {status : "inactive"}
            )
            req.flash("success" , "Đổi trạng thái tất cả sản phẩm đã chọn thành công!!");
            break;
        case "delete" :
            await Product.updateMany(
                {
                    _id : {$in : ids}
                },
                {
                    $set :{
                        deleted: true,
                        dateDeleted: new Date()
                    }
                }
            )
            req.flash("success" , "Xóa sản phẩm thành công!!");
            break;
        case "change-position" :
            case "change-position" :
                for (const tmp of ids) {
                    const [id, position] = tmp.split("-");
                    const parsedPosition = parseInt(position);
                    await Product.updateOne({ _id: id }, { position: parsedPosition });
                }
                req.flash("success" , "Đổi vị trí tất cả sản phẩm đã chọn thành công!!");
            break;
    } 
    res.redirect("back");
}

module.exports.deleteProduct = async (req , res) => {
    const id = req.params.id;
    await Product.updateOne({_id : id}  , {$set:{deleted : true, dateDeleted: new Date()}});
    req.flash("success" , "Xóa sản phẩm thành công!!");
    res.redirect("back");
}

module.exports.create = (req , res) => {
    res.render("admin/pages/createProduct/index.pug" , {
        titlePage: "Trang tạo mới sản phẩm"
    })
}

module.exports.createNewProduct = async (req , res) => {
    if(!req.body.title)
    {
        req.flash("error" , "Sản phẩm bạn tạo bắt buộc phải có tên sản phẩm !!")
        res.redirect("back");
        return;
    }
    if(req.body.discount != "")
    {
        req.body.discount = parseInt(req.body.discount);
    }
    if(req.body.price != "")
    {
        req.body.price = parseInt(req.body.price + "000");
    }
    if(req.body.stock)
    {
        req.body.stock = parseInt(req.body.stock);
    }
    if(req.body.position == "")
    {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    }
    else
    {
        req.body.position = parseInt(req.body.position);
    }
    if(req.file)
    {
        req.body.thumbnail = `/admin/uploads/${req.file.filename}`;
    }
    const product = new Product(req.body);
    await product.save();
    req.flash("success" , "Tạo mới sản phẩm thành công!!");
    res.redirect("back");
}