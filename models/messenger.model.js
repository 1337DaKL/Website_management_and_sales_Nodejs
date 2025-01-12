const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const messengerSchema = new mongoose.Schema(
    {
        title: String,
        name: String,
        email: String,
        telephone: String,
        content: String,
        status: String,
        slug: { type: String, slug: "title", unique: true },
        deleted: {
            type: Boolean,
            default: false
        },
        position: Number,
        deletedBy: {
            idAccountDeleted: String,
            dateDeleted: Date
        }
    }
);


const Messenger = mongoose.model('Messenger', messengerSchema, "messenger");


module.exports = Messenger;