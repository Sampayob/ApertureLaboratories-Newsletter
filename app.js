const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");

require('dotenv').config();
const api_key = process.env.API_KEY;
const list_id = process.env.LIST_ID;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res){

  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [
      {email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
    ]
  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us2.api.mailchimp.com/3.0/lists/" + String(list_id),
    method: "POST",
    headers: {
      "Authorization": "OAuth " + String(api_key)
    },
    body: jsonData
  };

  request(options,function(error, response, body){
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });

  console.log(firstName, lastName, email);

});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
