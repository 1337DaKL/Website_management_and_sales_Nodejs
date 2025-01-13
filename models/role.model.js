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
        },
        updatedBy: [
            {
                idAccountUpdated: String,
                nameAccountUpdated: String,
                dateUpdated: Date,
                oldRole: {
                    title: String,
                    description: String,
                    permission: {
                        type: Array,
                        default: []
                    },
                },
                newRole: {
                    title: String,
                    description: String,
                    permission: {
                        type: Array,
                        default: []
                    },
                },
            }
        ]
    }
);


const Role = mongoose.model('Role', RoleSchema, "role");


module.exports = Role;