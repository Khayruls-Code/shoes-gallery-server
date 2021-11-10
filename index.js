const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
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

    app.get('/products', async (req, res) => {
      const cursor = productCollection.find({})
      const result = await cursor.toArray()
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