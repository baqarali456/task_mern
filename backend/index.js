import dotenv from "dotenv"
dotenv.config()
import { app } from "./app.js"
import { connectDB } from "./src/db/db.js"


connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
       console.log('Server Listening on http://localhost:',process.env.PORT)
    })

})
.catch((err)=>{
    console.log("MONGODB DATABASE CONNECTION FAILED IN CATCH CALLBACK",err);
    process.exit(1)
})