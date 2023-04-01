// Import Mongoose
const mongoose = require('mongoose');

// Import Product model
const Product = require('./models/productModel');

// Connect to MongoDB


mongoose.connect('mongodb+srv://hugodardill:hugodardill@cluster0.uaokru6.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// Read the JSON file
const products = require('./eshops/product.json');

// Loop through each product and add to the database
products.forEach(async (product) => {
  try {
    // Create a new Product document
    const newProduct = new Product(product);

    // Save the new Product document to the database
    await newProduct.save();
  } catch (err) {
    console.log(err);
  }
});

console.log('Imported products to MongoDB');
