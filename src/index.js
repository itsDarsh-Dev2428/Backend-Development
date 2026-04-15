import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import { DB_NAME } from "./constants.js"
import connectDB from "./db/index.js"
import {app} from "./app.js"


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

console.log("URI:", process.env.MONGODB_URI); 


























/* const app = express();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;


const connectionString = MONGODB_URI.endsWith(`/${DB_NAME}`)
  ? MONGODB_URI
  : `${MONGODB_URI}/${DB_NAME}`;

(async () => {
  try {
    await mongoose.connect(connectionString);
    app.on("error", (error) => {
      console.log("ERRR:", error);
      throw error;
    });
    app.listen(PORT, () => {
      console.log(`App is listening on Port ${PORT}`);
    });
  } catch (error) {
    console.error("ERROR:", error);
    throw error;
  }
})();
*/
