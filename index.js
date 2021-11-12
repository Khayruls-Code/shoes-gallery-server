const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('shoes gallery server running...')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xfro9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect()
    const database = client.db('shoes-gallery')
    const productCollection = database.collection('products')
    const reviewCollection = database.collection('reviews')
    const orderCollection = database.collection('orders')

    //get products api
    app.get('/products', async (req, res) => {
      const cursor = productCollection.find({})
      const result = await cursor.toArray()
      res.json(result)
    })

    //review api
    app.get('/reviews', async (req, res) => {
      const cursor = reviewCollection.find({})
      const result = await cursor.toArray()
      res.json(result)
    })

    //getting apecific
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id
      const query = { '_id': ObjectId(id) }
      const result = await productCollection.findOne(query)
      res.json(result)
    })

    //order post api
    app.post('/orders', async (req, res) => {
      const data = req.body
      const result = await orderCollection.insertOne(data)
      res.json(result)
    })
    app.get('/orders', async (req, res) => {
      const email = req.query.email
      const query = { email: email }
      let cursor;
      if (email) {
        cursor = orderCollection.find(query)
      }
      else {
        cursor = orderCollection.find({})
      }
      const result = await cursor.toArray()
      res.json(result)
    })

    //order delete api
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id
      const query = { '_id': ObjectId(id) }
      const result = await orderCollection.deleteOne(query)
      res.json(result)
    })

  }
  finally {
    // await client.close()
  }
}

run().catch(console.dir)

app.listen(port, () => {
  console.log('I am listening port no: ', port)
})