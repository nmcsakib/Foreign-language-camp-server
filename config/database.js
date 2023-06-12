// Import the MongoDB client
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// MongoDB connection URI with credentials and connection options
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5qgd7kh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1, // Set the MongoDB server API version to v1
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10 // Set the maximum number of connections in the connection pool
});

// Establish a connection to the MongoDB server
try {
  client.connect(err => {
    if (err) {
      console.log(err);
      return;
    }
  });

  // Ping the MongoDB deployment to check the connection
  client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
} finally {
  // Perform any cleanup or additional logic here
}

// Export the MongoDB client instance for usage in other parts of the application
module.exports = { client };
