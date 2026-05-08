require("dotenv").config();

const mongoose = require("mongoose");
const Owner = require("../models/Owner");
const connectDB = require("../config/database");

// ==================== SEED OWNER ====================
const seedOwner = async () => {
  try {
    console.log("🌱 Starting owner data seeding...");

    await connectDB();

    const deleteResult = await Owner.deleteMany({});
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} existing owners`);

    const owner = new Owner({
      username: "admin",
      password: "Admin@123",
      email: "owner@rainbow.com",
      fullName: "Rainbow Owner",
    });

    await owner.save();

    console.log("✅ Owner created successfully");
    console.log("   Username: admin");
    console.log("   Password: Admin@123");
    console.log("   Email: owner@rainbow.com");
    console.log("   Full Name: Rainbow Owner");

    console.log("\n✨ Owner seeding completed successfully!");
  } catch (error) {
    console.error("❌ Owner seeding failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

seedOwner();