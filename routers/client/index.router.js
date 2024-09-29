// cac route cua web

// nhung router cua trang product 
const productsRouter = require("./products.router.js");
const homeRouters = require("./home.router.js");
module.exports = (app) => {
    // trang chu
    app.use("/" , homeRouters);
    app.use("/products" , productsRouter);
}


