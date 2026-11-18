const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_resume_mern';

mongoose.connect(MONGO_URI).then((res)=>{
    console.log("Database Connected Successfully");
}).catch(err=>{
    console.log("Database Connection Error:", err.message);
});
