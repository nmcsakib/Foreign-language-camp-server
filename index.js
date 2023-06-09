const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY)
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ error: true, message: 'unauthorized access' });
  }
  // bearer token
  const token = authorization.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: true, message: 'unauthorized access' })
    }
    req.decoded = decoded;
    next();
  })
}


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5qgd7kh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    // all collections

    const usersCollection = client.db("foreign-language-camp").collection("users")
    const classCollection = client.db("foreign-language-camp").collection("classes");
    const selectedClassCollection = client.db("foreign-language-camp").collection("selectedClasses");
    const paymentCollection = client.db("foreign-language-camp").collection("payments");

    // all collections


    //security apis
    app.post('/jwt', (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

      res.send({ token })
    })

    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email }
      const user = await usersCollection.findOne(query);
      if (user?.role !== 'admin') {
        return res.status(403).send({ error: true, message: 'forbidden message' });
      }
      next();
    }
    const verifyInstructor = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email }
      const user = await usersCollection.findOne(query);
      if (user?.role !== 'instructor') {
        return res.status(403).send({ error: true, message: 'forbidden message' });
      }
      next();
    }
    //security apis

    // all CRUD operations

    // users
    app.get('/users', verifyJWT, verifyAdmin, async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.post('/users',  async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user.email }
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: 'user already exists' })
      }

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });


    app.patch('/users/admin/:id', verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const makeRole = req.body.role;
      console.log(req.body, id);
      
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: makeRole
        },
      };

      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);

    })
// check admin
app.get('/users/:email', verifyJWT, async (req, res) => {
  const email = req.params.email;

  if (req.decoded.email !== email) {
    res.send({ admin: false })
  }

  const query = { email: email }
  const user = await usersCollection.findOne(query);
  const result = { role: user.role }
  console.log(result);
  res.send(result);
})

// insctructors
app.get('/instructors/:limit', async(req, res) => {
  const limit = req.params.limit;
  if(limit === 'six'){
    const result = await usersCollection.find({role: "instructor"}).limit(6).toArray();
    res.send(result);
  }
 else{
  const result = await usersCollection.find({role: "instructor"}).toArray();
  res.send(result);
 }
})

    app.get('/classes', verifyJWT, verifyAdmin, async(req, res) => {
      const result = await classCollection.find().toArray();
      res.send(result);
    })
    app.get('/active-classes/:limit', async(req, res) => {
      const limit = req.params.limit;
      if(limit === 'six'){
         const result = await classCollection.find({status: 'approved'}).limit(3).toArray();
      res.send(result);
      }else{
        const result = await classCollection.find({status: 'approved'}).toArray();
        res.send(result);
      }

     
    })
    app.get('/classes/:email', verifyJWT, verifyInstructor, async(req, res) => {
      const result = await classCollection.find({instructorEmail: req.params.email}).toArray();
      console.log(req.params.email, result);
      res.send(result);
    })
    app.post('/classes', verifyJWT, verifyInstructor, async (req, res) => {
      const newClass = req.body;
      console.log(newClass);
      const result = await classCollection.insertOne(newClass)
      res.send(result)
    })
    
    app.patch('/classes/:id', verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const makeStatus = req.body.status;
      const feedback = req.body.feedback;
      console.log(req.body, id);
      
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: makeStatus,
          feedback: feedback
        },
      };

      const result = await classCollection.updateOne(filter, updateDoc);
      res.send(result);

    })
//selected classes
app.get('/selected-classes/:email', verifyJWT, async(req, res) => {
  console.log(req.params.email);
  const result = await selectedClassCollection.find({email: req.params.email}).toArray();
  console.log(result);
  res.send(result)
})
app.post('/selected-classes',verifyJWT, async(req, res) => {

  const selectedClass = req.body;
  const alreadySelected = await selectedClassCollection.findOne({class: selectedClass});
  console.log(selectedClass, alreadySelected);
  if(selectedClass === alreadySelected){
    res.send({message: "already selected"})
  }
  const result = await selectedClassCollection.insertOne(selectedClass);
  res.send(result)
})

 // create payment intent
 app.post('/create-payment-intent', verifyJWT, async (req, res) => {
   const { price } = req.body;
   console.log(price);
  const amount = parseInt(price * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    payment_method_types: ['card']
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  })
})


  // payment related api
  app.post('/payments', verifyJWT, async (req, res) => {
    const payment = req.body;
    console.log(payment);
    const insertResult = await paymentCollection.insertOne(payment);

    const deleteResult = await selectedClassCollection.deleteOne({_id: new ObjectId(payment.classId)})

    res.send({ insertResult, deleteResult });
  })

  app.get('/enrolled-classes/:email', verifyJWT, async(req,res) => {
    const email = req.params.email;
    const result = await paymentCollection.find({email: email}).toArray();
    res.send(result)
  })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('boss is sitting')
})

app.listen(port, () => {
  console.log(`Foreign language camp is running ${port}`);
})


