// jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static("public")); // use this to make static images and files available to the server.

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res) { // 'req' comes from client via the form
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data); // flatten out the 'data' varible from line 23.
  const url = 'https://us8.api.mailchimp.com/3.0/lists/117777a8a4';
  const options = {
    method: "POST",
    auth: "skg360:2f54a71061a3c69737dcf697d8bf67c6-us8"
  };

  const request = https.request(url, options, function(response) { //response is an object
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) { //use 'on' method on 'response' to search thru server data in response
      console.log(JSON.parse(data)); // transforms server data into javascript object
    });
  });

  request.write(jsonData);
  request.end();

  console.log(firstName, lastName, email);
});

app.post('/failure', function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on Port 3000.")
});
