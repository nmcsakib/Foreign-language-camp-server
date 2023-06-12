const { selectedClassCollection } = require("../models/collections");

const { ObjectId } = require('mongodb')
const getSelectedClass = async (req, res) => {
  console.log(req.params.email);
  const result = await selectedClassCollection.find({ email: req.params.email }).toArray();
  // console.log(result);
  res.send(result)
}

const setSelectedClass = async (req, res) => {

  const classDetails = req.body;
 
  const alreadySelected = await selectedClassCollection.findOne({ title : classDetails.title, email: classDetails.email});
  console.log('classId', classDetails?.title, classDetails?.email);
  console.log('already ' , alreadySelected?.title);
 
  if (classDetails.title === alreadySelected?.title ) {
    res.status(400).send({ message: "already selected" })
    return
  }
else{
  
  const result = await selectedClassCollection.insertOne(classDetails);
  res.send(result)
}
}

const removeSelectedClass = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  const id = req.params.id;
  console.log('from 217', id);
  const result = await selectedClassCollection.deleteOne({ _id: new ObjectId(id)})
  console.log('delete', result);
  res.send(result)
}
module.exports = { getSelectedClass, setSelectedClass, removeSelectedClass }