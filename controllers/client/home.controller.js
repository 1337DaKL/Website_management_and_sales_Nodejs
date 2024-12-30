const Messenger = require("../../models/messenger.model");
const { model } = require("mongoose");
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL
    }
});

module.exports.index = (req, res) => {
    res.render("client/page/home/index.pug", {
        titlePage: "Trang chu"
    });
}
module.exports.contact = async (req, res) => {
    if (!req.body.email || !req.body.telephone) {
        req.flash("error", "Bắt buộc phải điền email và số điện thoại!!");
        res.redirect("back");
        return;
    }
    if(!req.body.title)
    {
        req.body.title = "";
    }
    req.body.status = "notSeen";
    const count = await Messenger.countDocuments();
    req.body.position = count + 1;
    const mailOptions = {
        from: 'luongtrinh2k3ndad@gmail.com',
        to: req.body.email,    
        subject: 'Store 1337_DaKL Xin chào',          
        text: 'Cảm ơn bạn đã quan tâm tới cửa hàng!! Nhân viên sẽ liên lạc với bạn sau'
    };
    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            if (error.response && error.response.includes('550 5.1.1')) {
                req.flash("error" , 'Email người nhận không tồn tại!');
                res.redirect("back");
            }
            else
            {
                console.log(error)
                req.flash("error" , error)
                res.redirect("back");
            }
        } else {
            const messenger = new Messenger(req.body);
            await messenger.save();
            req.flash("success" , "Gửi tin nhắn thành công !!");
            res.redirect("back");
        }
    });
}
module.exports.viewContact = (req , res) => {
    res.render("client/page/contact/index.pug" , {
        titlePage : "Trang liên hệ"
    })
}