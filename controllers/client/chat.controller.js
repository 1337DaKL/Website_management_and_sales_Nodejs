module.exports.index = async (req , res) => {
    //socketio
    _io.on('connection' , (socket) => {
        console.log("a" ,socket.id);
    } )
    //end socketio
    res.render("client/pages/chat/index.pug" , {
        titlePage : "Nhắn tin"
    })
}