import mongoose from "mongoose";

export const connectDB = async () => {
    return await mongoose
        .connect("mongodb://127.0.0.1:27017/job-search-app")
        .then((e) => console.log("db Run"))
        .catch((error) => console.log(error));
};
