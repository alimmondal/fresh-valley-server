const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5055

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.es092.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("freshValley").collection("products");
  console.log('database connected');


  app.get('/products', (req, res) => {
    productsCollection.find()
    .toArray((err, items) => {
      res.send(items);
      // console.log('from database', items)
    })
  })


  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    // console.log('adding product', newProduct)
    productsCollection.insertOne(newProduct)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })


});


app.listen(port)