const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
exports.connectDB = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/thaytoancovua");
    console.log('mongoDB connected');
}