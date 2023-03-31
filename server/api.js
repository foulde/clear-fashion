const express =require('express')
const mongoose= require('mongoose')
const Product = require('./models/productModel')
const app= express()

const PORT = 8092;

 
//express midelware
app.use(express.json())
app.use(express.urlencoded({extended: false}))


// to declare routes
app.get('/',(req,res)=>{
    res.send('hello')
})

//j'ai fait app.get pour tester
app.get('/brand',(req,res)=>{
    res.send('there are some brands here')
})



//to get data from database

app.get('/products', async (req, res) => {
    try {
      const products = await Product.find({});
      res.status(200).json(products);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  });
  
  // to get a specific product by its id
  app.get('/products/:id',async(req, res)=>{
    try{
        const {id}=req.params;
        const product= await Product.findById(id);
        res.status(200).json(product)
    }catch(error){
        res.status(500).json({message:error.message})

    }
  })



app.post('/products', async(req,res)=>{
    try{
        const product= await Product.create(req.body)
        res.status(200).json(product);

    }catch(error){
        console.log(error.message)
        res.status(500).json({message : error.message})
    

    }
})

//update a product
app.put('/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: `Cannot find product with ID ${id}` });
      }
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
// delete product 
app.delete('/products/:id', async(req, res)=>{
        try{
            const {id}= req.params;
            const product = await Product.findByIdAndDelete(id);
            if(!product){
                return res.status(404).json({message: `cannot find product with ID ${id}`});
            }
            res.status(200).json(product)
        }catch(error){
            res.status(500).json({ message: error.message });

        }

})

mongoose.set('strictQuery',false)
mongoose.connect('mongodb+srv://hugodardill:hugodardill@cluster0.meat52d.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    app.listen(process.env.PORT ,()=> {
        console.log('Node API is running on port 3000')
    })
    console.log('connected to mongodb')
})

// mongoose.set('strictQuery',false)
// mongoose.connect('mongodb+srv://hugodardill:hugodardill@cluster0.meat52d.mongodb.net/?retryWrites=true&w=majority')
// .then(()=>{
//     app.listen(process.env.PORT || 3000,()=> {
//         console.log('Node API is running on port 3000')
//     })
//     console.log('connected to mongodb')
// }).catch(()=>{
//     console.log(error)
// })