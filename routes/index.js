var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();
const { mongodb,mongoclient,dbUrl } = require("../dbConfig");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//this is to get all the jobs posted by admin
router.get("/jobs", async(req,res) => {
  
  const client = await mongoclient.connect(dbUrl);
  try {
    const db = client.db("placements");
    const data = await db.collection("jobs").find().toArray();
    res.send({message:"job fetched successfully",data:data});
  } catch(error) {
   console.log(error);
   res.send({message:("Internal server error")});
  } finally {
    client.close();
  }
});

//this is to get particular  jobs by job id posted by admin
router.get("/jobs/:id", async(req,res) => {
  
  const id = req.params.id;
  const client = await mongoclient.connect(dbUrl);
  try {
    const db = client.db("placements");
    const data = await db.collection("jobs").findOne({_id: new ObjectId(id)});
    res.send({message:"job fetched successfully",
    data:data});
  } catch(error) {
   console.log(error);
   res.send({message:("Internal server error")});
  } finally {
    client.close();
  }
});

//this is to post the jobs by admin
router.post("/jobs", async(req,res) => {
  
  const client = await mongoclient.connect(dbUrl);
  try {
    const db = client.db("placements");
    const data = await db.collection("jobs").insertOne(req.body);
    res.send({message:"job created successfully"});
  } catch(error) {
   console.log(error);
   res.send({message:("Internal server error")});
  } finally {
    client.close();
  }
});

//this is to delete the jobs
router.delete("/jobs/:id", async(req,res) => {
  
  const id = req.params.id;
  const client = await mongoclient.connect(dbUrl);
  try {
    const db = client.db("placements");
    const data = await db.collection("jobs").deleteOne({_id: new ObjectId(id)});
    res.send({message:"job deleted successfully"});
  } catch(error) {
   console.log(error);
   res.send({message:("Internal server error")});
  } finally {
    client.close();
  }
});

//this is to update the post created
router.put("/jobs/:id", async(req,res) => {
  
  const id = req.params.id;
  const client = await mongoclient.connect(dbUrl);
  try {
    const db = client.db("placements");
    const data = await db.collection("jobs").updateOne({_id: new ObjectId(id)},{$set:{...req.body}});
    //const data = await db.collection("jobs").updateOne({_id: new ObjectId(id)},{$set:{companyname:req.body.companyname,rolename:req.body.rolename,description:req.body.description}});
    res.send({message: "job updated successfully"});
  } catch(error) {
   console.log(error);
   res.send({message:("Internal server error")});
  } finally {
    client.close();
  }
});


//student route starts

//for creating a student
router.post("/create-student",async(req,res) => {
 
  const client = await mongoclient.connect(dbUrl);
  try{
    const db = client.db("placements");
    const data = await db.collection("students").insertOne(req.body);
    res.send({message:"Student created successfully"});
  }catch(error){
    console.log(error);
    res.send({message: ("Internal server error")});
  }finally{
    client.close();
  }
});

//a student applying for job
router.post("/apply",async(req,res) => {

  //steps needed
  // 1.jobID from body
  // 2.Student ID from body
  // 3.map the student id in applied object of applicant in jobs db
  // 4. map the job id to the job fields of student db

  const jobId = ObjectId(req.body.jobId);
  const id = ObjectId(req.body.id);

  const client = await mongoclient.connect(dbUrl);
  try{
    const db = client.db("placements");
    const data = await db.collection("jobs").findOne({_id:jobId});//here object is there so push has not been used here
    {
      data.applicants.applied.push(id);
      const updateData = await db.collection("jobs").updateOne({_id: jobId},{$set:{applicants:data.applicants}});

      const sData = await db.collection("students").updateOne({_id:id},{$push:{jobs: jobId}});
      res.send({message: "Job applied successfully"});
    }
    
    if(data.applicants.applied.indexOf(id) >=0 ||data.applicants.rejected.indexOf(id) >=0){
      res.send({message:"You have already applied for this job"});
    }else{
    data.applicants.applied.push(id);
    const updateData = await db.collection("jobs").updateOne({_id: jobId},{$set:{applicants:data.applicants}});

    const sData = await db.collection("students").updateOne({_id:id},{$push:{jobs: jobId}});//for diectly pushing into array push has been used
    //sData.jobs.push(jobId);
    //const updatesData = await db.collection("students").updateOne({_id: id},{$set: {jobs: sData.jobs}});

    res.send({message: "Job applied successfully"});
    }
    
  }catch(error){
    console.log(error);
    res.send({message: ("Internal server error")});
  }finally{
    client.close();
  }
});

//admin rejecting students for job
router.put("/reject",async(req,res) => {

  //steps needed
  // 1.jobID from body
  // 2.Student ID from body
  // 3.delete the id from applied and add it to the rejected

  const jobId = ObjectId(req.body.jobId);
  const id = ObjectId(req.body.id);

  const client = await mongoclient.connect(dbUrl);
  try{
    const db = client.db("placements");
    const data = await db.collection("jobs").findOne({_id:jobId});//here object is there so push has not been used here
    if(data.applicants.applied.indexOf(id)||data.applicants.rejected.indexOf(id)){
      res.send({message:"You have already applied for this job and have been rejected"});
    }else{
    data.applicants.rejected.push(id);
    data.applicants.applied.splice(data.applicants.applied.indexOf(id),1);
    const updateData = await db.collection("jobs").updateOne({_id: jobId},{$set:{applicants:data.applicants}});

    res.send({message: "Student rejected successfully"});
    }
  }catch(error){
    console.log(error);
    res.send({message: ("Internal server error")});
  }finally{
    client.close();
  }
});

module.exports = router;
