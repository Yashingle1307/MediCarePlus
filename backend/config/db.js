import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://YashIngle:Yash0508@cluster0.zownxeg.mongodb.net/MediCarePlus?retryWrites=true&w=majority"
        );
        console.log("DB Connected");
    } catch (error) {
        console.log("DB Error:", error.message);
    }
};


