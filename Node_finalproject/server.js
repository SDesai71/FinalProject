//hello
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const MongoClient = require('mongodb').MongoClient;
const assert = require("assert");
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');

const uri = "mongodb+srv://RJEakin:xgk6viue@node-cluster-sriig.mongodb.net/test?retryWrites=true";

var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));


hbs.registerPartials(__dirname+'/views/partials');

app.set('view engine','hbs');

app.use(express.static(__dirname+'/views/public'));
app.use(express.static(__dirname+'/views'));


/*MongoClient.connect(uri,{ useNewUrlParser: true }, function(err, client) {
    assert.equal(null, err);
    const db = client.db("Clicker");
    db.collection('Users').insertOne({
        _id: "dsadfad",
        Email : "Reakin@gmail.com",
        password : "112343452"

    }).then(function(result){

    });
    doc =  db.collection('Users').findOne({Username: "Eakin"})
        .then(function (doc) {
            if(doc == null){
                console.log('User does not exist')
            }else{
                console.log('User exists')
            }
        });
    client.close();
});*/

app.get('/clicker',(request, response)=>{
    response.render('clicker.hbs');
    console.log(request.cookies.ID)
});

app.get('/',(request,response)=>{
    response.render('login.hbs')
});


app.post('/login',(request,response)=>{
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        var database = client.db("Clicker");
        database.collection('Users').findOne({Username: request.body.Username, Password: request.body.Password})
            .then(function (doc) {
                if(doc == null){
                    console.log('Invalid Username or Password');
                    response.redirect('/');
                }else{
                    console.log('User Found');
                    //console.log(doc._id);
                    response.cookie('ID',doc._id,{maxAge : 1000*60*15});
                    response.redirect('/clicker');
                }
            })
    });
    //response.render('login.hbs');
});

app.post('/register',(request,response)=>{
   MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        let uid = uuid();
        var database = client.db("Clicker");
       database.collection('Users').findOne({Username: request.body.Username})
           .then(function (doc) {
               if(doc == null){
                   console.log('User does not exist');
                   database.collection("Users").insertOne({
                       _id: uid,
                       Username: request.body.Username,
                       Password: request.body.Password
                   });
                   database.collection("Scores").insertOne({
                       _id: uid,
                       Username: request.body.Username,
                       totalClicks: 0,
                       Clicks: 0,
                       lvl: 1
                   });
                   console.log("User added to Database");
                   response.cookie('ID',doc._id,{maxAge : 1000*60*15});
                   response.redirect('/');
               }else{
                   console.log('Did not write to database');
                   response.redirect('/');
               }
           })
   });

});

app.listen(8080,() =>{
   console.log(('server is up and listing on port 8080'))
});