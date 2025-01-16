const Category = require("../models/category.model");
const getChildCategory = async (idParentCategory) => {
    const childsCategory = await Category.find(
        {
            deleted: false,
            idParent: idParentCategory,
            status : "active"
        }
    )
    let arrayChild = [...childsCategory];
    for (let child of childsCategory) {
        const getChild = await getChildCategory(child.id);
        arrayChild = arrayChild.concat(getChild);
    }
    return arrayChild;
}

module.exports.arrayCategory = await getChildCategory(categoryProduct.id);