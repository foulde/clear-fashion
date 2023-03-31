const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://hugodardill:hugodardill@cluster0.uaokru6.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error(error));

// Define the Product schema
const productSchema = new mongoose.Schema({
  brand_name: { type: String, required: true },
  link: { type: String, required: false },
  img: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: String, required: true },
}, {
  timestamps: true,
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

app.use(express.json());
app.use(cors());

// Define the routes
app.get('/', (req, res) => {
  res.send('Hello from the API!');
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(process.env.PORT || 3000, () => console.log(`Server started on port ${process.env.PORT || 3000}`));
