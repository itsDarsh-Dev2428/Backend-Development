import mongoose, {Schema} from "mongoose";

const SubSchema = new Schema( {
    subscriber : {
        types: Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {
        types: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})


export const Subscription = mongoose.model("SubSchema", SubSchema)

