const express = require("express");
const https = require("https");
const bodyparser = require("body-parser");
const app = express()

app.use(express.static("public"));

// TRansfer all the static images in the folder named as public.

app.use(bodyparser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){

    const firstname = req.body.fname; 
    const lastname = req.body.lname;
    const email = req.body.email;

    const data = {
        members:[
            {
                email_address:email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstname,
                    LNAME: lastname,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    
    const url = "https://us21.api.mailchimp.com/3.0/lists/d9a8561b1c"
    const options={
        method:"POST",
        auth:"bhaskar:aae084eed6ce558514bcde092d46fb24-us21"
    }
    const request = https.request(url,options,function(response){

            if(response.statusCode === 200)
            {
                res.sendFile(__dirname+"/success.html");
            }
            else{
                res.sendFile(__dirname+"/failure.html");
            }
           response.on("data",function(data){
            console.log(JSON.parse(data));
           }) 
    })

    request.write(jsonData);
    request.end();


});

app.post("/failure",function(req,res){
    res.redirect("/"); 
})

app.post("/success",function(req,res){
    res.sendFile(__dirname+"/mainnews.html"); 
})


app.listen(3000,function(){
    console.log("Server is listening on port 3000.")
})

// API key:aae084eed6ce558514bcde092d46fb24-us21
// List ID : d9a8561b1c
