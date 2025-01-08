const mongoose = require("mongoose");
const RoleSchema = new mongoose.Schema(
    {
        title : String,
        description: String,
        permission : {
            type : Array,
            default : []
        },
        deleted: {
            type : Boolean,
            default: false
        },
        dateDeleted: Date,
    },{
        timestamps: true
    }
);


const Role = mongoose.model('Role' , RoleSchema , "role");


module.exports = Role;