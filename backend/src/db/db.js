import mongoose from "mongoose";


const connectDB =async() =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
        console.log('MONGODB CONNECTED SUCCESSFULLY IN TRY BLOCK',connectionInstance.connection.host);
    } catch (error) {
        console.log('MONGODB CONNECTION FAILED IN CATCH BLOCK',error);
        throw error;
    }
}

export {
    connectDB,
}