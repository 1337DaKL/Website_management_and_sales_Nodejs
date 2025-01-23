// cac route cua web

// nhung router cua trang product 
const productsRouter = require("./products.router.js");
const homeRouters = require("./home.router.js");
const categoryMiddleware = require("../../middlewares/client/category.middlewares.js");
const searchRouter = require("./search.router.js");
const cartMiddleware = require("../../middlewares/client/cart.middleware.js");
const cartRouter = require("./cart.router.js");
const checkoutRouter = require("./checkout.router.js");
const userRouter = require("./user.router.js");
const userMiddleware = require("../../middlewares/client/user.middleware.js");
const settingMiddleware = require("../../middlewares/client/setting.middleware.js");
module.exports = (app) => {
    // trang chu
    app.use(categoryMiddleware.requireCategory);
    app.use(settingMiddleware.general);
    app.use(cartMiddleware.createCart)
    app.use(userMiddleware.userInfor);
    app.use("/", homeRouters);
    app.use("/products", productsRouter);
    app.use("/search", searchRouter);
    app.use("/cart", cartRouter);
    app.use("/checkout", checkoutRouter);
    app.use("/user", userRouter);
}


