const Category = require("../../models/category.model");
const treeHelper = require("../../helper/findTree");
module.exports.requireCategory = async (req, res, next) => {
    const find = {
        deleted: false,
        status: "active"
    }
    const categorys = await Category.find(find);
    const categoryTree = treeHelper(categorys);
    res.locals.categoryTree = categoryTree;
    next();
}