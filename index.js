const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json())

const uri = "mongodb+srv://dbuser:WkhLNvDVpFIUtAqU@cluster0.notujmp.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const optionsCl = client.db("task").collection("options");
        const selectedOptionsCl = client.db("task").collection("selectedOptions");

        app.get('/options', async(req, res) =>{
            const cursor = optionsCl.find({});
            const options = await cursor.toArray();
            res.send(options)
        })
        app.post('/elected-options', async(req, res) =>{
            const selectedO = req.body;
            const result = await selectedOptionsCl.insertOne(selectedO);
            res.send(result);
        })
        app.get('/elected-options', async(req, res) =>{
            const cursor = selectedOptionsCl.find({});
            const alldata = await cursor.toArray();
            res.send(alldata);
        })
        app.patch('/elected-options/:id', async(req, res) =>{
            const updatesDtl = req.body
            const update = await selectedOptionsCl.updateOne({_id: ObjectId(req.params.id)}, {$set: updatesDtl})
            res.send(updatesDtl)
        })
    }
    finally{

    }
}
run().catch(err => console.log(err))

app.get('/',async(req, res) =>{
res.send('This Server is running')
})

app.listen(port)