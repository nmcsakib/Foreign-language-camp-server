const { usersCollection } = require("../models/collections");

const getInstructors = async(req, res) => {
    const limit = req.params.limit;
    if(limit === 'six'){
      const result = await usersCollection.find({role: "instructor"}).limit(6).toArray();
      res.send(result);
    }
   else{
    const result = await usersCollection.find({role: "instructor"}).toArray();
    res.send(result);
   }
  }
  module.exports = {getInstructors}