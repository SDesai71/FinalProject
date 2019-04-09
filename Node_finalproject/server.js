const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');

const uri = "mongodb+srv://RJEakin:xgk6viue@node-cluster-sriig.mongodb.net/test?retryWrites=true";

var app = express();

app.use(cookieParser('se cret'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
hbs.registerPartials(__dirname+'/views/partials');

app.set('view engine','hbs');
app.use(express.static(__dirname+'/views/public'));
app.use(express.static(__dirname+'/views'));


app.get('/',(request,response)=>{
    response.render('login.hbs')
});

app.get('/clicker',(request, response)=>{
    if (request.signedCookies.ID == undefined){
        response.redirect('/')
    }else {
        MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
            var database = client.db("Clicker");
            database.collection('Scores').findOne({_id: request.signedCookies.ID})
                .then(function (doc) {
                    response.render('clicker.hbs',{
                        username:doc.Username
                    });
                })
        });
    }
});

app.get('/getstats',(req,res)=>{
    MongoClient.connect(uri,{useNewUrlParser: true}, (err,client)=>{
        var database = client.db('Clicker');
        database.collection('Scores').find({_id: req.signedCookies.ID}).toArray((err,result)=>{
            if (err) res.send('Error querying database!');
            //console.log(result);
            res.send(result)
        })
    })
});


app.post('/login',(request,response)=>{
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        var database = client.db("Clicker");
        database.collection('Users').findOne({Username: request.body.Username, Password: request.body.Password})
            .then(function (doc) {
                if(doc == null){
                    response.render('login.hbs',{
                        loginmsg: 'Username or Password Incorrect'
                    });
                }else{
                    response.cookie('ID',doc._id,{signed: true});
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
                   //console.log('User does not exist');
                   database.collection("Users").insertOne({
                       _id: uid,
                       Username: request.body.Username,
                       Password: request.body.Password
                   });
                   database.collection("Scores").insertOne({
                       _id: uid,
                       Username: request.body.Username,
                       Clicks: 0,
                       totalClicks: 0,
                       lvl: 1,
                       Lionel: 0,
                       Chritiano: 0,
                       Paul: 0,
                       Eden: 0,
                       Neymar: 0,
                       Zlatan: 0
                   });
                   //console.log("User added to database");
                   response.cookie('ID',uid,{signed:true});
                   response.redirect('/clicker');
               }else{
                   //console.log('Did not write to database');
                   response.render('login.hbs',{
                       Registermsg:'Username already in use!'
                   });
               }
           })
   });
});

app.get('/logout',(req,response)=> {
    response.clearCookie('ID');
    response.redirect('/')
});

app.get('/getscores',(req,res)=>{
    MongoClient.connect(uri,{useNewUrlParser: true}, (err,client)=>{
        var database = client.db('Clicker');
        database.collection('Scores').find().project({Username: 1, totalClicks: 1, _id: 0}).toArray((err,result)=>{
            if (err) res.send('Error querying database!');
            result.sort(function (a,b) {return b.totalClicks - a.totalClicks});
            res.send(result)
        })
    })
});

app.get('/leaderboard',(req,res)=>{
    res.render('leaderboard.hbs');
});


app.post('/update',(req,res)=> {
    try {
        let query = {_id: req.signedCookies.ID};
        let info = {$set:req.body};
        MongoClient.connect(uri, {useNewUrlParser: true}, (err, client) => {
            if(err) throw err;
            var database = client.db("Clicker");
            database.collection('Scores').updateOne(query, info, function (err, res) {
                if (err) throw err;
            })
        })
    }
    catch (e) {
        res.redirect('/')
    }
});

app.listen(8080,() =>{
   console.log(('server is up and listing on port 8080'))
});