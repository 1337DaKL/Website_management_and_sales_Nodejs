const Messenger = require("../../models/messenger.model");
module.exports.index = async (req , res) => {
    let find = {
        deleted : true
    }
    const status = req.query.status;
    if(status)
    {
        find.status = status
    }
    const messengerDeleted = await Messenger.find(find);
    res.render("admin/pages/dustbinMess/index.pug" , {
        titlePage: "Thùng rác tin nhắn", 
        mess : messengerDeleted
    })
}