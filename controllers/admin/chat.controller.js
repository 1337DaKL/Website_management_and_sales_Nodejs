const Messenger = require("../../models/messenger.model");
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
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const status = req.query.status;
    if (status) {
        find.status = status
    }

    const mess = await Messenger.find(find);
    res.render("admin/pages/chat/index.pug", {
        mess: mess,
        titlePage: "Tin nhắn khách hàng"
    })
}
module.exports.viewMess = async (req, res) => {
    await Messenger.updateOne({ _id: req.params.id }, { status: "seen" });
    const mess = await Messenger.findOne({ _id: req.params.id });
    res.render("admin/pages/chat/detel.pug", {
        mess: mess,
        titlePage: `Chi tiết tin nhắn gửi từ ${mess.name}`
    });
}
module.exports.deleteMess = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("messenger_delete")) {
        const deletedBy = {
            idAccountDeleted: res.locals.userLogin.id,
            dateDeleted: new Date()
        }
        await Messenger.updateOne({ _id: req.params.id }, {
            $set: {
                deleted: true,
                deletedBy: deletedBy
            }
        });
        req.flash("success", "Xóa tin nhắn thành công !!");
        res.redirect("back");
    }
    else {
        res.send("Hack faild");
    }

}
module.exports.replyMess = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("messenger_reply")) {
        const mess = await Messenger.findOne({ _id: req.params.id });
        if (!req.body.titleRep || !req.body.contentRep) {
            req.flash("error", "Tiêu đề hoặc nội dung gửi mail không được bỏ trống");
            res.redirect("back");
            return;
        }
        const mailOptions = {
            from: 'luongtrinh2k3ndad@gmail.com',
            to: mess.email,
            subject: req.body.titleRep,
            text: req.body.contentRep
        };
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                if (error.response && error.response.includes('550 5.1.1')) {
                    req.flash("error", 'Email người nhận không tồn tại!');
                    res.redirect("back");
                }
                else {
                    req.flash("error", error)
                    res.redirect("back");
                }
            } else {
                req.flash("success", "Gửi tin nhắn thành công !!");
                res.redirect("back");
            }
        });
    }
    else {
        res.send("Hack faild");
    }

}
module.exports.deleteMulti = async (req, res) => {
    if (res.locals.roleLogin.permission.includes("messenger_delete")) {
        if (req.query["multi-id"] === "") {
            req.flash("error", "Bạn chưa chọn tin nhắn nào!!");
            res.redirect("back");
            return;
        }
        const arrayId = req.query["multi-id"].split(",");
        const deletedBy = {
            idAccountDeleted: res.locals.userLogin.id,
            dateDeleted: new Date()
        }
        await Messenger.updateMany(
            {
                _id: { $in: arrayId }
            },
            {
                $set: {
                    deleted: true,
                    deletedBy: deletedBy
                }
            });
        req.flash("success", "Xóa tất cả  tin nhắn thành công!!");
        res.redirect("back");
    }
    else {
        res.send("Hack faild");
    }

}
