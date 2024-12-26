import { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name : {
            type : String,
            required : true
        },
        username : {
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String,
            require : true,
        }
    }
)