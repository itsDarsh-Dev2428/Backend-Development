import { setDefaultResultOrder } from "dns"
setDefaultResultOrder("ipv4first")
import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"
import dns from "dns"
dns.setDefaultResultOrder("ipv4first")  

const connectDB = async ()=> {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n MongoDB connected !! DB HOST:${connectionInstance.connection.host} `)
        
    } catch (error) {
        console.error("MONGODB connection error", error)
        process.exit(1)
    }
}

export default connectDB