const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const { UserModel } = require("./Models/UserModel");
const JobModel = require("./Models/JobModel");


const app = express()
app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    res.send("Hello");
});

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const checkUser = await UserModel.findOne({ email })
    if (checkUser) {
        res.send("User is already registered!")
    }
    try {
        const user = await new UserModel({ name, email, password })
        user.save()
        res.send("Sign up Successfully!!")
    }
    catch (err) {
        console.log(err)
        res.send("Something went wrong, pls try again later")
    }
})


// login route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        const user = await UserModel.findOne({ email: email });

        if (user != null) {

            if (user.email === email) {
                // console.log("reg_user",email,password)
                let token = jwt.sign(
                    {
                        userID: user?._id,
                        email: user?.email,
                    },
                    "UNI245",
                    { expiresIn: "7d" }
                );
                res.status(200).send({ message: "User Logged in Succefully!!", token: token });
            } else {
                res.status(401).send({ message: "Incorrect! Enter correct password!!" });
            }
        } else {
            res.status(405).send({ message: "User not found with this email, need to register!" });
        }
    }
})

//admin route
app.get('/admin',(req,res)=>{
    res.send('admin page ')
})

app.post('/admin/jobPost',async(req,res)=>{
    const { company, location, contract, position} =
        req.body;

    const job_lists = new JobModel({
        company,
        location,
        contract,
        position,
    });
    await job_lists.save();
    res.send({ "message": "Job posted successfully" });

})
app.delete('/admin/delete/:id',async(req,res)=>{
    
    const { id } = req.params;
    try {
        await JobModel.findByIdAndDelete({ _id: id });
        res.send({ "message": "Job Deleted Successfully!!" })
    } catch (error) {
        res.status(400).send({ "message": "Something Went Wrong" });
    }
})

app.patch('/admin/edit/:id', async (req, res) => {
    const payload = req.body;
    const { id } = req.params;
    if (payload === '') res.status(400).send({ "message": "Need to Login First" })
    else {
        try {
            await JobModel.findByIdAndUpdate({ _id: id }, payload);
            res.send({ "message": "Job Updated Successfully!!" });
        } catch (error) {
            res.status(400).send({ "message": "Something Went Wrong" });
        }
    }
});

//user router to list all jobs
app.get('/admin/jobList',async(req,res)=>{
    let jobs=[]
   const data=await JobModel.find()
   jobs.push({data})
   res.send(jobs)
})
app.get('/user/jobList', async (req, res) => {
    let jobs = []
    const data = await JobModel.find()
    jobs.push({ data })
    res.send(jobs)
})


app.get('/applied',(req,res)=>{
    res.send()
})





mongoose.set('strictQuery', true)
mongoose.connect('mongodb+srv://janhavi:12345@cluster0.esiytt3.mongodb.net/job-app?retryWrites=true&w=majority').then(() => {
    app.listen(8080, () => {
        console.log(`Server Started @ http://localhost:8080`);
    });
})