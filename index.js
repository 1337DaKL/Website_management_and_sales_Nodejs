//Nhung express
const systemConfig = require("./configs/systems.js");
const express = require("express");
const app = express();
//Nhung filr env vao

require("dotenv").config();
const port = process.env.PORT;
//express-flash chenf thông báo 
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session')


const passwordcookieParser = process.env.PASSWORLD;
app.use(cookieParser(passwordcookieParser));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
//end express-flash
//Body parser
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
//End Bodey parser

//method-overide
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
//end method-overide


//nhung database vao    
const database = require("./configs/database.js")
database.connect();

//Nhung file tinh
app.use(express.static("public"));


//Nhung route vao file

const router = require("./routers/client/index.router.js");
router(app);
const dashboard = require("./routers/admin/index.router.js");
dashboard(app);


//cai pug

app.set("views" , "./views");
app.set("view engine" ,"pug");

//App locals Variables
app.locals.frefixAdmin = systemConfig.prefixAdmin; 


//kiem tra web co chay khong
app.listen(port , () => {
    console.log(`Running in port ${port}`);
});