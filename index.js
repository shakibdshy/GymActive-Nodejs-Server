const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9i21l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const inventoryCollection = client.db('gymActive').collection('inventory');
        const newInventoryCollection = client.db('gymActive').collection('newInventory');

        // Get Inventory
        app.get('/inventory', async(req, res) => {
            const query = {};
            const inventory = await inventoryCollection.find(query).toArray();
            res.send(inventory);
        });

        // Get Inventory by ID
        app.get('/inventory/:inventoryId', async(req, res) => {
            const id = req.params.inventoryId;
            const query = {_id: ObjectId(id)};
            const inventory = await inventoryCollection.findOne(query);
            res.send(inventory);
        });

        // Post a new Inventory
        app.post('/inventory', async(req, res) => {
            const newInventory = req.body;
            const result = await inventoryCollection.insertOne(newInventory);
            res.send(result);
        });

        // Delete a Inventory
        app.delete('/inventory/:inventoryId', async(req, res) => {
            const id = req.params.inventoryId;
            const query = {_id: ObjectId(id)};
            const result = await inventoryCollection.deleteOne(query);
            res.send(result);
        })

        // New Inventory Collection
        app.get('/newitems', async (req, res) => { 
            const email = req.query.email;
            const query = {email: email};
            const newInventory = await newInventoryCollection.find(query).toArray(); 
            res.send(newInventory);
        });

        app.post('/newitems', async(req, res) => {
            const newInventory = req.body;
            const result = await newInventoryCollection.insertOne(newInventory);
            res.send(result);
        });

        // Delete a New Inventory Items
        app.delete('/newitems/:newitemsId', async (req, res) => {
            const id = req.params.newitemsId;
            const query = { _id: ObjectId(id) };
            const result = await newInventoryCollection.deleteOne(query);
            res.send(result);
        })

        // Get New Inventory Items by ID
        app.get('/newitems/:newitemsId', async (req, res) => {
            const id = req.params.newitemsId;
            const query = { _id: ObjectId(id) };
            const result = await newInventoryCollection.findOne(query);
            res.send(result);
        })

        // Get Quantity
        app.put('/update-quantity/:id', async (req, res) => {
            const id = req.params.id;
            const updatedInventoryInfo = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedInventoryInfo.quantity,
                    sold: updatedInventoryInfo.sold
                }
            }
            const result = await inventoryCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })
    }
    finally {}
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Server');
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})