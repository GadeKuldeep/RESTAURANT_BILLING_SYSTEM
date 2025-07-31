// resetAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "./models/Admin.js";

await mongoose.connect("mongodb://localhost:27017/billing_system"); // use your DB name

const email = "admin@billing.com";
const plainPassword = "admin@123";
const hashedPassword = await bcrypt.hash(plainPassword, 10);

await Admin.updateOne(
  { email },
  { $set: { password: hashedPassword } },
  { upsert: true }
);

console.log("✅ Admin password hashed and saved");
await mongoose.disconnect();
