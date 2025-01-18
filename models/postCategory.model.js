const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const postCategorySchema = new mongoose.Schema(
    {
        title: String,
        idPostCategoryParent: String,
        thumbnail: String,
        status: String,
        description: String,
        slug: { type: String, slug: "title", unique: true },
        deleted: {
            type: Boolean,
            default: false
        },
        position: Number,
        deletedBy: {
            idAccountDeleted: String,
            nameAccountDeleted: String,
            dateDeleted: Date
        },
        createdBy: {
            idAccountCreated: String,
            nameAccountCreated: String,
            dateCreated: {
                type: Date,
                default: Date.now
            }
        }
        ,
        updatedBy: [
            {
                idAccountUpdated: String,
                nameAccountUpdated: String,
                dateUpdated: Date,
                oldPostCategory: {
                    title: String,
                    idPostCategoryParent: String,
                    thumbnail: String,
                    status: String,
                    description: String,
                    position: Number
                },
                newPostCategory: {
                    title: String,
                    idPostCategoryParent: String,
                    thumbnail: String,
                    status: String,
                    description: String,
                    position: Number
                },
            }
        ]
    }
);


const PostCategory = mongoose.model('PostCategory', postCategorySchema, "postCategory");


module.exports = PostCategory;