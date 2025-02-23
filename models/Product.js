const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }, // URL or path to the image
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

module.exports = mongoose.model('Product', productSchema);