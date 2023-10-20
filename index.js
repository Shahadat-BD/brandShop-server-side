const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.lwsgehv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("BrandProduct");
    const productCollection = database.collection("product");
    const myCartCollection = database.collection("myCart");


    // get product form database

    app.get("/product", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // get all product only brand form database

    app.get("/product/:brandName", async (req, res) => {
      const brandName = req.params.brandName;
      const query = { brandName : brandName };
      const filterBrandName = productCollection.find(query);
      const result = await filterBrandName.toArray()
      res.send(result);
    });
    
    //  get specific user added product

    app.get("/my-cart/:id",async(req,res)=>{
         const id = req.params.id
         const query = {_id : id}
         const result = await myCartCollection.findOne(query)
         res.send(result)
    })
     
    // user product delete 
 
    app.delete('/my-cart/:id',async(req,res)=>{
      const id = req.params.id
      const query = { _id : id };
      const result = await myCartCollection.deleteOne(query);
        res.send(result)
    })

    // get my product cart form database
    app.get("/my-cart", async (req, res) => {
      const cursor = myCartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // product added in database by post
    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    // myCart add in database 
    app.post('/my-cart',async(req,res)=>{
          const myCart = req.body
          const result = await myCartCollection.insertOne(myCart)
          res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("e commerce branding shop is coming");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
