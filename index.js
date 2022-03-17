const express = require('express')
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

//middlewire
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ugc7c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
        await client.connect();
        console.log('database connected successfully');
        const database = client.db('intern_database');
        const dataCollection = database.collection('formInput');

        //get api of services
        app.get('/data', async (req, res) => {
            const cursor = dataCollection.find({});
            const dataAll = await cursor.toArray();
            res.send(dataAll);
        })

        //post api
        app.post('/add', async (req, res) => {
            const newUser = req.body;
            const result = await dataCollection.insertOne(newUser);
            console.log('Got new user', req.body);
            console.log('added user', result);
            // res.send(JSON.stringify(result)) 

            //alternative of stringify kore posting....  res.send(JSON.stringify(newUser)) & post jehetu pura  result tak json hishebe client side e pathno jabe
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {

    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
