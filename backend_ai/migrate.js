require('dotenv').config();
const mongoose = require('mongoose');
const UserModel = require('./Models/user');
const ResumeModel = require('./Models/resume');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_resume_mern';

async function runMigration() {
    console.log("🔄 Starting MongoDB initialization / migration...");
    console.log(`📡 Connecting to: ${MONGO_URI.replace(/\/\/.*@/, '//<credentials>@')}`);

    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Successfully connected to MongoDB.");

        // 1. Ensure indexes for performance and uniqueness
        console.log("⚙️  Creating indexes...");
        await UserModel.collection.createIndex({ email: 1 }, { unique: true, background: true });
        await ResumeModel.collection.createIndex({ user: 1 }, { background: true });
        await ResumeModel.collection.createIndex({ createdAt: -1 }, { background: true });
        console.log("✅ Indexes verified for Users and Resumes.");

        // 2. Count existing documents
        const userCount = await UserModel.countDocuments();
        const resumeCount = await ResumeModel.countDocuments();
        console.log(`📊 Current Database Stats:`);
        console.log(`   - Users: ${userCount}`);
        console.log(`   - Resumes: ${resumeCount}`);

        console.log("🎉 Database migration / initialization completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Database migration failed:", err.message);
        process.exit(1);
    }
}

runMigration();
