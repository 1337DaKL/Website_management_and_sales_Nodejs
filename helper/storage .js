var multer = require('multer');
module.exports  = () => {
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/admin/uploads');
        },
        filename: function(req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        },
    });
    return storage;
}