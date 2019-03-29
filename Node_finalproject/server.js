const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');

const uri = "mongodb+srv://RJEakin:xgk6viue@node-cluster-sriig.mongodb.net/test?retryWrites=true";

var app = express();
app.use(cookieParser('secret'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));


hbs.registerPartials(__dirname+'/views/partials');

app.set('view engine','hbs');

app.use(express.static(__dirname+'/views/public'));
app.use(express.static(__dirname+'/views'));

app.get('/clicker',(request, response)=>{
    if (request.signedCookies.ID == undefined){
        response.redirect('/')
    }else {
        MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
            var database = client.db("Clicker");
            database.collection('Scores').findOne({_id: request.signedCookies.ID})
                .then(function (doc) {
                    response.render('clicker.hbs',{
                        lvl:doc.lvl,
                        totalClicks: doc.totalClicks,
                        clicks: doc.Clicks
                    });
                })
        });
        console.log(request.signedCookies.ID)
    }
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
                    //console.log('Invalid Username or Password');
                    response.redirect('/');
                }else{
                    //console.log('User Found');
                    response.cookie('ID',doc._id,{maxAge : 3000*60*15, signed: true});
                    response.redirect('/clicker');
                }
            })
    });
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
                   response.cookie('ID',uid,{maxAge : 3000*60*15, signed:true});
                   response.redirect('/');
               }else{
                   console.log('Did not write to database');
                   response.redirect('/');
                   database.close()
               }
           })
   });
});

app.post('/logout',(res,req)=> {
    let query = {_id: res.signedCookies.ID};
    let info = {$set:res.body};
    // console.log(query);
    // console.log(info);
    MongoClient.connect(uri, {useNewUrlParser: true}, (err, client) => {
        var database = client.db("Clicker");
        database.collection('Scores').updateOne(query, info, function (err, res) {
            if (err) throw err;
            console.log('doc updated!');
            console.log('User log out');
            res.clearCookie('ID');
            res.redirect('/');
        })
    })
});
app.post('/test',(res,req)=> {
    let query = {_id: res.signedCookies.ID};
    let info = {$set:res.body};
    // console.log(query);
    // console.log(info);
    MongoClient.connect(uri, {useNewUrlParser: true}, (err, client) => {
        var database = client.db("Clicker");
        database.collection('Scores').updateOne(query, info, function (err, res) {
            if (err) throw err;
            console.log('doc updated!');
        })
    })
});


app.listen(8080,() =>{
   console.log(('server is up and listing on port 8080'))
});