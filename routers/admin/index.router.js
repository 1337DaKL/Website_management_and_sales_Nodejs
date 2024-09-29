const dashboardRouter = require("./dashboard.router");
const systemConfig = require("../../configs/systems");
const productsRouter = require("./products.router");
const dustbinRouter = require("./dustbin.router");
module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + "/" ,dashboardRouter);
    app.use(PATH_ADMIN + "/products" , productsRouter);
    app.use(PATH_ADMIN + "/dustbin" , dustbinRouter);
};