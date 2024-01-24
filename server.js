require("dotenv").config();
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
var _ = require('lodash');
const mongoose = require("mongoose");
const https = require('https');
const app = express();
const portNum = process.env.portNum || 3000;


app.use(bodyparser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGODB_CONNECT);

const progressSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true
    },
    PostDescription: {
        type: String,
        require: true
    }
});
const SignUpDBSchema = new mongoose.Schema({
    email_info: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Message: {
        type: String
    }
});

const postInfo = mongoose.model("postdetails", progressSchema);
app.get('/', async (req, res) => {

    const processDetailsList = await postInfo.find({});
    res.render("index", { progressLists: processDetailsList })
})


app.get('/aboutUs', (req, res) => {
    res.render('aboutUs');
})

app.get('/contactUs', (req, res) => {
    res.render('contactUs');
})

app.get('/AddProgress', (req, res) => {
    res.render('addProgress');
})


app.get("/posts/:postName", async (req, res) => {

    const postid = _.lowerCase(req.params.postName);
    const processDetailsList = await postInfo.find({});
    processDetailsList.forEach((post) => {
        const titleid = _.lowerCase(post._id);
        if (titleid === postid) {
            res.render('post', { PostTitle: post.Title, PostDescription: post.PostDescription });
        }
    });
});

app.post('/AddProgress', async (req, res) => {
    const posttitle = req.body.postTitle;
    const postdesc = req.body.postdescription;

    var progress = new postInfo({
        Title: posttitle,
        PostDescription: postdesc
    });

    await progress.save();

    res.redirect('/AddProgress');
})

app.post('/contactUs', (req, res) => {
    const name = req.body.Name;
    const email = req.body.email;
    const message = req.body.message;
    try {
        const usersinfo = mongoose.model("usersInfo", SignUpDBSchema);

        const userdetail = new usersinfo({
            email_info: email,
            Name: name,
            Message: message
        })

        userdetail.save();
        res.sendFile(path.join(__dirname, '/public/success.html'))
    }
    catch (err) {
        console.log(err);
        res.sendFile(path.join(__dirname, '/public/failure.html'));
    }


})

app.post('/failure', (req, res) => {
    res.redirect("/contactUs");
})


app.listen(portNum, () => {
    console.log(`Successfully connected to port ${portNum} :)`);
})