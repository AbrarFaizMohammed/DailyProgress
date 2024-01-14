const express = require('express');
const path  = require('path');
const bodyparser = require('body-parser');
var _ = require('lodash');
const https = require('https');

const app = express();
const portNum = process.env.portNum || 3000;

const progressDetailsList = new Array();

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));


app.set("view engine","ejs");
app.set("views", path.join(__dirname,"/public"))

app.get('/',(req,res)=>{
   res.render("index",{progressLists: progressDetailsList})
})


app.get('/aboutUs',(req,res)=>{
    res.render('aboutUs');
})

app.get('/contactUs',(req,res)=>{
    res.render('contactUs');
})

app.get('/AddProgress',(req,res)=>{
    res.render('addProgress');
})


app.get("/posts/:postName",(req,res)=>{
    
    const postname = _.lowerCase(req.params.postName);
    progressDetailsList.forEach((post)=>{
        const titleName = _.lowerCase(post.Title);
        if(titleName === postname)
        {
            res.render('post',{PostTitle:post.Title,PostDescription:post.Description});
        }
    });
        res.sendFile(path.join(__dirname,"/public/style.css"));
});

app.post('/AddProgress',(req,res)=>{
    const posttitle = req.body.postTitle;
    const postdesc = req.body.postdescription;

    var progress = {
        Title: posttitle,
        Description: postdesc
    };
    progressDetailsList.push(progress);
    res.redirect('/AddProgress');
})

app.post('/contactUs', (req, res) => {
    const name = req.body.Name;
    const email = req.body.email;
    const message = req.body.message;
    console.log(name+" "+email+" "+message);

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                NAME: name,
                MESSAGE: message
            }
        }]
    }

    const jsonData = JSON.stringify(data);
    const url = 'https://us11.api.mailchimp.com/3.0/lists/f331d05aff';

    const Option = {
        method:'POST',
        auth:'abrar:774408c8e4e6b541d199e804dca9d0c8-us11'
    }

  const request= https.request(url,Option,(response)=>{
   if(response.statusCode ===200)
   {
        res.sendFile(path.join(__dirname,'/public/success.html'))

   }
   else
   {
    res.sendFile(path.join(__dirname,'/public/failure.html'));
   }

    response.on('data',(dt)=>{
        console.log(JSON.parse(dt));
    })
})
request.write(jsonData);
request.end();

})

app.post('/failure',(req,res)=>{
    res.redirect("/contactUs");
})


app.listen(portNum,()=>{
    console.log(`Successfully connected to port ${portNum} :)`);
})