import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema(
    {
        user_id : {
            type : String
        },
        meetingCode : {
            type : String ,
            required : true
        },
        user_id : {
            type : String,
            default : Date.now,
            required:true
        }
    }
)

const Meeting = mongoose.model("Meeting",meetingSchema);

export { Meeting };
