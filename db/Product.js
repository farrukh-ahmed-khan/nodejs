const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: String,
    price: String,
    category: String,
    userid: String,
    company: String,
});

module.exports = mongoose.model('products', ProductSchema);