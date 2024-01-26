import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTIONS = {
      dbName: "Auth"
    };
    await mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log("DATABASE CONNECTED");
  } catch (error) {
    console.log("Something went wrong...", error);
  }
};
export default connectDB;
