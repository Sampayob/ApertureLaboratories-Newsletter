const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");

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
    url: "https://us2.api.mailchimp.com/3.0/lists/4ba4bf24c9",
    method: "POST",
    headers: {
      "Authorization": "OAuth accca55e1f81b417afc7c7ddfa54f8c7-us2"
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

//mailchimp API Key
// accca55e1f81b417afc7c7ddfa54f8c7-us2

// amilchimp listid
//4ba4bf24c9
