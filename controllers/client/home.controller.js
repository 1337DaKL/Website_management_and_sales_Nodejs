module.exports.index = (req , res) => 
{
    res.render("client/page/home/index.pug" , {
        titlePage : "Trang chu"
    });
}