const express = require('express')
const bodyParser = require('body-parser')
const cors =require('cors')

const MongoClient = require('mongodb').MongoClient;
const ObjectId= require('mongodb').ObjectId;


require('dotenv').config();

const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kxnhm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const apartmentCollection = client.db("apartmentHunt").collection("apartmentDetails");
  const adminCollection = client.db("apartmentHunt").collection("admin");
  const rentDetailsCollection = client.db("apartmentHunt").collection("rentDetails");

  app.post('/addAll', (req, res)=>{
    const order = req.body;
    // console.log(order);
    apartmentCollection.insertMany(order)
    .then( result=>{
      console.log(result.insertedCount)
      res.send(result.insertedCount>0);
      
       })
  })
  app.post('/addApartment', (req, res)=>{
    const order = req.body;
    // console.log(order);
    apartmentCollection.insertOne(order)
    .then( result=>{
     // console.log(result.insertedCount)
      res.send(result.insertedCount>0);
      
       })
  })
  app.post('/addAdmin', (req, res)=>{
    const admin = req.body;
    // console.log(order);
    adminCollection.insertMany(admin)
    .then( result=>{
      console.log(result.insertedCount)
      res.send(result.insertedCount>0);
      
       })
  })

  app.post('/addRentDetails', (req, res)=>{
    const rent = req.body;
    // console.log(order);
    rentDetailsCollection.insertOne(rent)
    .then( result=>{
     // console.log(result.insertedCount)
      res.send(result.insertedCount>0);
      
       })
  })

  app.get('/allApartment', (req, res)=>{
    apartmentCollection.find({})
    .toArray((err, documents)=>{
     // console.log(documents);
      res.send(documents)
    
  
    })
  })
  app.get('/allBookingList', (req, res)=>{
    rentDetailsCollection.find({})
    .toArray((err, documents)=>{
     // console.log(documents);
      res.send(documents)
    
  
    })
  })
  app.get('/findApartment/:id', (req, res)=>{
    console.log(req.params.id);
    apartmentCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, document)=>{
    //  console.log(document[0]);
        res.send(document[0]);
    })
})

app.patch('/update/:id', (req, res)=>{

  rentDetailsCollection.updateOne({_id: ObjectId(req.params.id)},
  {
      $set: {status: req.body.status}
  })
  .then(result=>{
      
     res.send(result.modifiedCount>0)
      
  }) 
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})


  console.log("database is started ")
  console.log(err)
  
});

app.listen((process.env.PORT ||port) )

