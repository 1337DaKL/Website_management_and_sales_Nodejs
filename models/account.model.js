const mongoose = require("mongoose");
const generateToken = require("../helper/generate");
const accountSchema = new mongoose.Schema(
    {
        fullName: String,
        avartar: String,
        email: String,
        password: String,
        token:
        {
            type: String,
            default: generateToken.generateToken(25)
        },
        idRole: String,
        telephone: String,
        address: String,
        status: String,
        deleted: {
            type: Boolean,
            default: false
        },
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
        },
        updatedBy: [
            {
                idAccountUpdated: String,
                nameAccountUpdated: String,
                dateUpdated: Date,
                oldAccount: {
                    fullName: String,
                    avartar: String,
                    email: String,
                    password: String,
                    idRole: String,
                    nameRole: String,
                    telephone: String,
                    address: String,
                    status: String
                },
                newAccount: {
                    fullName: String,
                    avartar: String,
                    email: String,
                    password: String,
                    idRole: String,
                    nameRole: String,
                    telephone: String,
                    address: String,
                    status: String
                }
            }
        ]
    }
);
const Account = mongoose.model('Account', accountSchema, "account");
module.exports = Account;