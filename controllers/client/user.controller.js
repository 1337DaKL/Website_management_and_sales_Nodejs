var md5 = require('md5');
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgotPassword.model");
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
module.exports.loginUser = async (req, res) => {
    res.render("client/pages/user/login.pug", {
        titlePage: "Đăng nhập"
    })
}
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register.pug", {
        titlePage: "Đăng kí"
    })
}
module.exports.registerPost = async (req, res) => {
    try {
        console.log(req.body);
        if (!req.body.fullName) {
            req.flash("error", "Họ và tên không được bỏ trống!");
            res.redirect("back");
            return;
        }
        if (!req.body.email) {
            req.flash("error", "Email không được bỏ trống!");
            res.redirect("back");
            return;
        }
        if (!req.body.password) {
            req.flash("error", "Mật khẩu không được bỏ trống!");
            res.redirect("back");
            return;
        }
        const exitsUser = await User.findOne(
            {
                deleted: false,
                email: req.body.email
            }
        );
        if (exitsUser) {
            req.flash("error", "Email đã tồn tại !");
            res.redirect("back");
            return;
        }
        req.body.password = md5(req.body.password);
        const user = new User(req.body);
        await user.save();
        res.cookie("tokenUser", user.tokenUser);
        req.flash("success", "Đăng nhập thành công!!");
        res.redirect("/");
    } catch (error) {
        req.flash("error", "Đăng kí tài khoản thất bại!! Vui lòng đăng kí lại!");
        res.redirect("back");
    }

}
module.exports.loginPost = async (req, res) => {
    try {
        if (!req.body.password) {
            req.flash("error", "Bạn chưa nhập mật khẩu!");
            res.redirect("back");
            return;
        }
        if (!req.body.email) {
            req.flash("error", "Bạn chưa nhập email!");
            res.redirect("back");
            return;
        }
        const exitsUser = await User.findOne(
            {
                email: req.body.email
            }
        );
        if (!exitsUser) {
            req.flash("error", "Email không tồn tại!");
            res.redirect("back");
            return;
        }
        if (md5(req.body.password) != exitsUser.password) {
            req.flash("error", "Mật khẩu không chính xác!");
            res.redirect("back");
            return;
        }
        if (exitsUser.status == "inactive") {
            req.flash("error", "Tài khoản đã bị khóa! Vui lòng liên hệ với quản trị viên!!");
            res.redirect("back");
            return;
        }
        res.cookie("tokenUser", exitsUser.tokenUser);
        req.flash("success", "Đăng nhập thành công!");
        res.redirect("/");
    } catch (error) {
        req.flash("error", "Đăng nhập thất bại!");
        res.redirect("back");
    }
}
module.exports.logoutPost = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
}
module.exports.viewForgotPassword = async (req, res) => {
    res.render("client/pages/user/forgotPassword.pug", {
        titlePage: "Lấy lại mật khẩu"
    })
}
module.exports.forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne(
            {
                deleted: false,
                email: email
            }
        )
        //Kiểm tra tài khoản
        if (!user) {
            req.flash("error", "Email không tồn tại");
            res.redirect("back");
            return;
        }
        if (user.status == "inactive") {
            req.flash("error", `Tài khoản đã bị khóa không lấy lại được mật khẩu!`);
            res.redirect("back");
            return;
        }
        const exitsForgotPassword = await ForgotPassword.findOne({
            email: email
        })
        if (exitsForgotPassword) {
            req.flash("error", "Bạn vừa lấy mã Otp vui lòng chờ 3 phút sau để lấy tiếp!!");
            res.redirect("back");
            return;
        }

        //end check
        //save otp
        const objectForgotPassword = {
            email: email,
        }
        const forgotPassword = new ForgotPassword(objectForgotPassword);
        await forgotPassword.save();
        //end save otp
        //send otp by email
        const mailOptions = {
            from: 'luongtrinh2k3ndad@gmail.com',
            to: email,
            subject: 'Mã OPT lấy lại mật khẩu tài khoản Cửa hàng 1337DaKL',
            text: `
    Xin chào ${user.fullName},
Chúng tôi đã nhận được yêu cầu lấy lại mật khẩu của bạn.

Mã Otp của bạn là: ${forgotPassword.otp}
Mã otp sẽ hết hạn sau 3 phút.
Vui lòng không chia sẻ mã này với bất kỳ ai.
NẾU CÓ NGƯỜI YÊU CẦU MÃ OTP NÀY.
Đừng chia sẻ mã này với bất kỳ ai, đặc biệt với người nói là họ làm việc cho cửa hàng . Họ có thể đang cố hack tài khoản của bạn.
BẠN KHÔNG GỬI YÊU CẦU NÀY.
Nếu bạn nhận được email này mà không phải đang muốn lấy lại mật khẩu, hãy cho chúng tôi biết. Bạn không cần làm thêm bước nào khác nếu chưa chia sẻ mã này với bất cứ ai. Nếu bạn đã lỡ cấp mã otp cho người khác hãy liên hệ với quản trị viên để xử lí.

Trân trọng cảm ơn!
`
        };
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                if (error.response && error.response.includes('550 5.1.1')) {
                    req.flash("error", 'Email người nhận không tồn tại!');
                }
                else {
                    console.log(error)
                    req.flash("error", error)
                }
            } else {
                req.flash("success", "Gửi tin nhắn thành công !!");
            }
        });
        //end send otp by email
        req.flash("success", "Gửi mã otp về gmail thành công !!");
        res.redirect(`/user/password/otp?email=${email}`);
    } catch (error) {
        req.flash("error", "Gửi mã otp về gmail không thành công !!");
        res.redirect(`back`);
    }
}
module.exports.viewOtp = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otpPassword.pug", {
        titlePage: "Nhập OTP",
        email: email
    })
}
module.exports.otp = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;
        if (!email) {
            req.flash("error", "Email không được bỏ trống");
            res.redirect("back");
            return;
        }
        if (!otp) {
            req.flash("error", "Mã otp không được bỏ trống");
            res.redirect("back");
            return;
        }
        const forgotPassword = await ForgotPassword.findOne(
            {
                email: email,
                otp: otp
            }
        )
        if (!forgotPassword) {
            req.flash("error", "Mã OTP không hợp lệ!! Vui lòng kiểm tra lại email đã nhận!");
            res.redirect("back");
            return;
        }
        const user = await User.findOne(
            {
                email: email
            }
        )
        if (user) {
            res.cookie("tokenUser", user.tokenUser);
        }
        await ForgotPassword.deleteOne(
            {
                email: email,
                otp: otp
            }
        )
        req.flash("success", "Xác nhận thành công!! Vui lòng nhập lại mật khẩu!!");
        res.redirect("/user/password/reset");
    } catch (error) {
        req.flash("error", "Xác nhận mã otp không thành công");
        res.redirect("back");
    }
}
module.exports.viewResetPassword = async (req, res) => {
    res.render("client/pages/user/resetPassword.pug", {
        titlePage: "Nhập lại mật khẩu"
    })
}
module.exports.resetPassword = async (req, res) => {
    try {
        const tokenUser = req.cookies.tokenUser;
        if (!tokenUser) {
            req.flash("error", "Vui lòng đăng nhập!!");
            res.redirect("back");
            return;
        }
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (password != confirmPassword) {
            req.flash("error", "Mật khẩu xác thực không trùng nhau! Vui lòng nhập lại");
            res.redirect("back");
            return;
        }
        const user = await User.findOne(
            {
                tokenUser: tokenUser,
                deleted: false
            }
        )
        if (!user) {
            req.flash("error", "Tài khoản đã bị xóa");
            res.redirect("back");
            return;
        }
        if (user.status == "inactive") {
            req.flash("error", "Tài khoản đã bị khóa!");
            res.redirect("back");
            return;
        }
        await User.updateOne(
            {
                tokenUser: tokenUser,
                deleted: false
            },
            {
                password: md5(password)
            }
        )
        req.flash("success", "Đổi mật khẩu thành công!!");
        res.redirect("/");
    } catch (error) {
        req.flash("error", "Đổi mật khẩu không thành công!!");
        res.redirect("back");
    }
}