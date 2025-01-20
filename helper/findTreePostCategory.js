function findTree(arr, idPostCategoryParent = "") {
    let tree = [];
    arr.forEach(item => {
        if (item.idPostCategoryParent === idPostCategoryParent) {
            let newItem = item;
            const childen = findTree(arr, item.id);
            if (childen.length > 0) {
                newItem.childen = childen;
            }
            tree.push(newItem);
        }
    });
    return tree;
}

module.exports = (arr) => {
    const treee = findTree(arr);
    return treee;
}