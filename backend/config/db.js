const mongoose = require('mongoose');
// const dotenv = require('dotenv'); // DIHAPUS
 
// dotenv.config({ path: '../.env' }); // DIHAPUS: Sudah di-handle di server.js
 
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Terhubung...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
 
module.exports = connectDB;