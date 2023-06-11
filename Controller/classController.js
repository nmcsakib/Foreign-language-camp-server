const { classCollection } = require("../models/collections");

const { ObjectId } = require('mongodb')
const getClasses = async(req, res) => {
    const result = await classCollection.find().toArray();
    res.send(result);
  }
  const getInstructorsClass = async(req, res) => {
    const result = await classCollection.find({instructorEmail: req.params.email}).sort({date: -1}).toArray();
    // console.log(req.params.email, result);
    res.send(result);
  }

  const getApprovedClasses =  async(req, res) => {
    const limit = req.params.limit;
    console.log(limit);
    if(limit === 'six'){
       const result = await classCollection.find({status: 'approved'}).limit(6).sort({totalStudents: -1}).toArray();
    res.send(result);
    }else{
      const result = await classCollection.find({status: 'approved'}).toArray();
      res.send(result);
    }

   
  }

  const postClass = async (req, res) => {
    const date = new Date()
    const newClass = req.body;
    const totalStudent = 0;
    // console.log(newClass);
    const result = await classCollection.insertOne({...newClass, totalStudent, date})
    res.send(result)
  }
const patchStatus = async (req, res) => {
    const id = req.params.id;
    const makeStatus = req.body.status;
    
    const feedback = req.body.feedback;
    // console.log(req.body, id);
    
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        status: makeStatus,
        feedback: feedback
      },
    };

    const result = await classCollection.updateOne(filter, updateDoc);
    res.send(result);

  }

  const updateSeatAndStudents = async(req, res) => {
    const id = req.params.id;
    console.log('157 ',id);
    const result = classCollection.findOneAndUpdate({ _id: new ObjectId(id) },
    { $inc: { seat: -1, totalStudents: 1 } },
    { returnOriginal: false })
    res.send(result)
  }


  module.exports = {getClasses,  getApprovedClasses, postClass, patchStatus, getInstructorsClass, updateSeatAndStudents}