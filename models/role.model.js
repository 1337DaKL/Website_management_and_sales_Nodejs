const mongoose = require("mongoose");
const RoleSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        permission: {
            type: Array,
            default: []
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            idAccountDeleted: String,
            dateDeleted: Date
        },
        createdBy: {
            idAccountCreated: String,
            dateCreated: {
                type: Date,
                default: Date.now
            }
        }
    }
);


const Role = mongoose.model('Role', RoleSchema, "role");


module.exports = Role;