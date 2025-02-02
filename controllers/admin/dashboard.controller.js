const Account = require("../../models/account.model");
const Product = require("../../models/products.model");
const Category = require("../../models/category.model");
const Messenger = require("../../models/messenger.model");
const Role = require("../../models/role.model");
const PostCategory = require("../../models/postCategory.model");
module.exports.dashboard = async (req, res) => {
    //account
    const account = {
    }
    account.countObject = await Account.countDocuments(
        {
            deleted: false
        }
    );
    account.countActive = await Account.countDocuments(
        {
            deleted: false,
            status: "active"
        }
    )
    account.countInactive = await Account.countDocuments(
        {
            deleted: false,
            status: "inactive"
        }
    )
    const product = {
    }
    product.countObject = await Product.countDocuments(
        {
            deleted: false
        }
    );
    product.countActive = await Product.countDocuments(
        {
            deleted: false,
            status: "active"
        }
    )
    product.countInactive = await Product.countDocuments(
        {
            deleted: false,
            status: "inactive"
        }
    )
    //end account
    //product category
    const productCategory = {
    }
    productCategory.countObject = await Category.countDocuments(
        {
            deleted: false
        }
    );
    productCategory.countActive = await Category.countDocuments(
        {
            deleted: false,
            status: "active"
        }
    )
    productCategory.countInactive = await Category.countDocuments(
        {
            deleted: false,
            status: "inactive"
        }
    )
    //end product category
    //messsenger
    const messenger = {
    }
    messenger.countObject = await Messenger.countDocuments(
        {
            deleted: false
        }
    );
    messenger.countSeen = await Messenger.countDocuments(
        {
            deleted: false,
            status: "seen"
        }
    )
    messenger.countNotSeen = await Messenger.countDocuments(
        {
            deleted: false,
            status: "notseen"
        }
    )
    //end messenger
    //role
    const role = {
    }
    role.countObject = await Role.countDocuments(
        {
            deleted: false
        }
    );
    role.countActive = await Role.countDocuments(
        {
            deleted: false,
            status: "active"
        }
    )
    role.countInactive = await Role.countDocuments(
        {
            deleted: false,
            status: "inactive"
        }
    )
    //end role
    //post category
    const postCategory = {
    }
    postCategory.countObject = await PostCategory.countDocuments(
        {
            deleted: false
        }
    );
    postCategory.countActive = await PostCategory.countDocuments(
        {
            deleted: false,
            status: "active"
        }
    )
    postCategory.countInactive = await PostCategory.countDocuments(
        {
            deleted: false,
            status: "inactive"
        }
    )
    //end post category
    res.render("admin/pages/dashboard/index.pug", {
        titlePage: "Trang tong quan",
        account: account,
        productCategory: productCategory,
        product: product,
        messenger: messenger,
        role: role,
        postCategory : postCategory
    })
}