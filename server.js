var express = require("express"); //pull in the express module
var app = express.createServer(); //create an express server.
app.listen(1337); //the server is created on localhost, port 1337
app.use(express.bodyParser());
/*
The server will respond with the relevant text on the GET request of
the root uri.
*/
app.get("/", function(req, res){
  res.send("this is a contact web service");
});

//pull in the mongojs module and connect to the mongodb database.
//I am using mongolab(http://mongolab.com) to store my data.
//var db = require('mongojs').connect('username:password@host.mongolab.com:port/mydatabase');
var db = require('mongojs').connect('localhost:27017/nem');
var contacts = db.collection('contacts'); //get a handle on the contacts collection within the database

//GET all contacts
app.get("/contact", function(req, res){
  var result = [];
  contacts.find().forEach(function(err, doc) {
    if(err){
      res.send("Oops!: " + err);
    }
    if (!doc) {
      //When all the documents in the collection has been visited, output the result.
      res.send(result);
      return;
    }
    //add the current doc in the loop to the result
    result.push(doc);
  });
});

//GET a specific contact
app.get('/contact/:id', function(req, res){
    contacts.findOne({ "_id" : db.ObjectId(req.params.id)}, function(err, doc){
      if(err){ 
        res.send("Oops! " + err); 
      }
      res.send(doc);
    });
});

//Create a contact
//On success, return the http response code 201
app.post('/contact', function(req, res){
  contacts.save(req.body.contact, function(err, doc){
    if(err) res.send("Oops!: " + err);
    if(doc){
      res.send(201);
    }
  });
});

//Update a contact
//On success, return the http response code 200
app.put('/contact/:id', function(req, res){
    contacts.save(
        {
            "_id" : db.ObjectId(req.params.id), 
            "firstname": req.body.contact.firstname,
            "lastname" : req.body.contact.lastname,
            "emails" : req.body.contact.emails
        }, 
        function(err, doc) {
            if(err){
                res.send(err);
            }
            res.send(200);
        }
    );    
});

//Delete a contact
app.delete('/contact/:id', function(req, res){
    contacts.remove({"_id": db.ObjectId(req.params.id)}, function(err,doc){
        if(err) {
            res.send("Err");
            return;
        }
        res.send();
    });
});

