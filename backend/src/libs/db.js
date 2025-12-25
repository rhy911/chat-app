import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // @ts-ignore
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING, {
      // These options ensure stable connection
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Liên kết CSDL thành công!");
    console.log(`Connected to database: ${mongoose.connection.name}`);
  } catch (error) {
    console.log("Lỗi khi kết nối CSDL:", error);
    process.exit(1);
  }
};