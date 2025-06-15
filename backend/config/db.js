const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Pastikan variabel MONGO_URI ada di file .env Anda
    if (!process.env.MONGO_URI) {
      console.error('FATAL ERROR: MONGO_URI is not defined in .env file.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // Keluar dari proses dengan status gagal
    process.exit(1);
  }
};

module.exports = connectDB;
