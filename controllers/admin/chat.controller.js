const Messenger = require("../../models/messenger.model");
module.exports.index = async (req , res ) => {
    let find = {
        deleted : false
    }
    const mess =  await Messenger.find(find);
    res.render("admin/pages/chat/index.pug" , {
        mess  : mess,
        titlePage : "Tin nhắn khách hàng"
    })
}
module.exports.viewMess = async (req , res) => {
    await Messenger.updateOne({_id : req.params.id} , {status : "seen"});
    const mess = await Messenger.findOne({_id : req.params.id});
    res.send("ok");
}