const { client } = require("../config/database");

// Accessing the desired collections from the client's database
const usersCollection = client.db("foreign-language-camp").collection("users");
const classCollection = client.db("foreign-language-camp").collection("classes");
const selectedClassCollection = client.db("foreign-language-camp").collection("selectedClasses");
const paymentCollection = client.db("foreign-language-camp").collection("payments");

// Exporting the collections
module.exports = {
  usersCollection,
  classCollection,
  selectedClassCollection,
  paymentCollection
};
