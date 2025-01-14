// cac route cua web

// nhung router cua trang product 
const productsRouter = require("./products.router.js");
const homeRouters = require("./home.router.js");
const categoryMiddleware = require("../../middlewares/client/category.middlewares.js");
module.exports = (app) => {
    // trang chu
    app.use("/", categoryMiddleware.requireCategory, homeRouters);
    app.use("/products", categoryMiddleware.requireCategory, productsRouter);
}


