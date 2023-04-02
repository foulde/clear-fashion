// Import Mongoose
const mongoose = require('mongoose');

// Define a Mongoose Schema for the product
const productSchema = new mongoose.Schema({
    // Brand name field (required)
    brand_name: {
        type: String,
        required: true
    },
    // Link field (optional)
    link: {
        type: String,
        required: false,
    },
    // Image URL field (required)
    img: {
        type: String,
        required: true,
    },
    // Title field (required)
    title: {
        type: String,
        required: true,
    },
    // Price field (required)
    price: {
        type: Number,
        required: true
    },
}, {
    // Add timestamps for created_at and updated_at fields
    timestamps: true
});

// Create a Mongoose model based on the product schema
const Product = mongoose.model('Product', productSchema);

// Export the Product model for use in other modules
module.exports = Product;
