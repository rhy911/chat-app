import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
  console.log("✅ Connected to test database");
});

afterAll(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
  
  await mongoose.connection.close();
  console.log("🛑 Test database connection closed");
});