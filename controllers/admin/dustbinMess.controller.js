const Messenger = require("../../models/messenger.model");
module.exports.index = async (req, res) => {
    let find = {
        deleted: true
    }
    const status = req.query.status;
    if (status) {
        find.status = status
    }
    const messengerDeleted = await Messenger.find(find);
    res.render("admin/pages/dustbinMess/index.pug", {
        titlePage: "Thùng rác tin nhắn",
        mess: messengerDeleted
    })
}
module.exports.deleteMulti = async (req, res) => {
    const ids = req.body.ids.split(",");
    await Messenger.deleteMany({
        _id: {
            $in: ids
        }
    })
    req.flash("success", "Xóa tin nhắn thành công");
    res.redirect("back");
}
module.exports.deleteMessenger = async (req, res) => {
    const id = req.params.id;
    await Messenger.deleteOne(
        {
            _id: id
        }
    )
    req.flash("success", "Xóa tin nhắn thành công!");
    res.redirect("back");
}