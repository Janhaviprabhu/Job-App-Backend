const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const { UserModel } = require("./Models/UserModel");


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

mongoose.set('strictQuery', true)
mongoose.connect('mongodb+srv://janhavi:12345@cluster0.esiytt3.mongodb.net/job-app?retryWrites=true&w=majority').then(() => {
    app.listen(8080, () => {
        console.log(`Server Started @ http://localhost:8080`);
    });
})