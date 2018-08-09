var express = require('express');
var http = require("http");
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './uploads' });
var bodyParser = require('body-parser');
var symptom = require('../model/symptoms');
var subSymptom = require('../model/subSymptom')
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var user = require('../model/user');
var doctor = require('../model/doctor');
var comm = require('../model/comm');
var app=express();
var currentCustId;
var uploaderName;
var query = {custId:''};
var Data =[]; 
var totalAmount = 0.0;
var url = "https://disease-id-helper.herokuapp.com/process_symptoms/";

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}





router.get('/', function(req, res, next) {
    res.render('respond with a resource');
});

router.get('/symptom',(req,res,next)=>{
    var data = []; 
    var lData = [];
    symptom.getData((err,result)=>{
        if(err) throw err;
        data = result;
        for(var i in data[4].symptom){

        	lData.push(data[4].symptom[i]);
        	console.log(data[4].symptom[i]);
        }
        res.render('index',{title: 'index', Data:lData});
    });
});
var filterSubSymptom = "";
// router.post('/symptom',(req,res,next)=>{
//     filterSubSymptom = req.body.val;
// 	res.redirect('/users/subSymptom');
// });
var data = [];
// router.get('/subSymptom',(req,res,next)=>{
//     subSymptom.getParticularData(filterSubSymptom,(err,result)=>{
//         data = result;
//         console.log("Hiiiii :"+data);
//         res.send(data);
//         res.render('index',{title: 'index'})
//     });
// })


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}
router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Register'});
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: {message:"Invalid Credentials"} }), function(req, res, next) {
    req.flash('success', 'Login Successful');
    res.redirect('/');
});

passport.serializeUser(function(userObj, done) {
    console.log("In serializeUser "+userObj);
    done(null, userObj.id);   
});
passport.deserializeUser(function(id, done) {
    currentCustId = id;
    query={custId:currentCustId};
    console.log(query);
    user.getUserById(id, function(err, userObj) {
        done(err, userObj);
    });
});
passport.use(new localStrategy((username, password, done) => {
    user.getUserByUsername(username, (err, userObj) => {
        if (err) throw err;
        if (!userObj) {
            return done(null, false, { message:'Unknown user' });
        }
        console.log("logging from passport.use: "+userObj);

    user.comparePasswords(password, userObj.password, (err, isMatch) => {
        console.log("Matching " + password);
        console.log("with " + userObj.password)
        if (err) return done(err);
        if (isMatch) {
            return done(null, userObj);
        } else {
            console.log("Invalid Password");
            return done(null, false, { message:'Invalid password' });
        }
    });
    });
}));
router.post('/register', function(req, res, next) {
    console.log(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    
    req.checkBody('name', 'Name field required').notEmpty();
    req.checkBody('email', 'email field required').notEmpty();
    req.checkBody('email', 'email is invalid').isEmail();
    req.checkBody('username', 'username field required').notEmpty();
    req.checkBody('password', 'password field required').notEmpty();
    req.checkBody('password2', 'passwords do not match').equals(req.body.password);

    var error = req.validationErrors();

    if (error) {
        res.render('register', {
            errors: error
        });
    } else {
        var newUser = new user({
            name: name,
            email: email,
            username: username,
            password: password,
        });
        user.createUser(newUser, (err, user) => {
            if (err) throw err;
            console.log(user);
        });
        req.flash('success', 'You are now registered!!!')
        res.location('/');
        res.redirect('/');
    }
});

//Doctor's Register and Login.

router.get('/docRegister', function(req, res, next) {
    res.render('docRegister', { title: 'Doctors Register'});
});

router.get('/docLogin', function(req, res, next) {
    res.render('docLogin', { title: 'Doctors Login' });
});

router.post('/docLogin', passport.authenticate('local', { failureRedirect: '/users/docLogin', failureFlash: {message:"Invalid Credentials"} }), function(req, res, next) {
    req.flash('success', 'Login Successful');
    res.redirect('/users/docHome');
});

passport.serializeUser(function(userObj, done) {
    console.log("In serializeUser "+userObj);
    done(null, userObj.id);   
});
passport.deserializeUser(function(id, done) {
    currentCustId = id;
    query={custId:currentCustId};
    console.log(query);
    doctor.getUserById(id, function(err, userObj) {
        done(err, userObj);
    });
});
passport.use(new localStrategy((username, password, done) => {
    doctor.getUserByUsername(username, (err, userObj) => {
        if (err) throw err;
        if (!userObj) {
            return done(null, false, { message:'Unknown user' });
        }
        console.log("logging from passport.use: "+userObj);

    doctor.comparePasswords(password, userObj.password, (err, isMatch) => {
        console.log("Matching " + password);
        console.log("with " + userObj.password)
        if (err) return done(err);
        if (isMatch) {
            return done(null, userObj);
        } else {
            console.log("Invalid Password");
            return done(null, false, { message:'Invalid password' });
        }
    });
    });
}));
router.post('/docRegister', function(req, res, next) {
    console.log(req.body.specialist);
    var name = req.body.name;
    var email = req.body.email;
    var speciality = req.body.specialist;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    
    req.checkBody('name', 'Name field required').notEmpty();
    req.checkBody('email', 'email field required').notEmpty();
    req.checkBody('email', 'email is invalid').isEmail();
    req.checkBody('specialist', 'Speciality field required').notEmpty();
    req.checkBody('username', 'username field required').notEmpty();
    req.checkBody('password', 'password field required').notEmpty();
    req.checkBody('password2', 'passwords do not match').equals(req.body.password);

    var error = req.validationErrors();

    if (error) {
        console.log(error)
        res.render('docRegister', {
            errors: error
        });
    } else {
        console.log("in else");
        var newUser = new doctor({
            name: name,
            speciality: speciality,
            email: email,
            username: username,
            password: password
        });
        console.log("newUser");
        console.log(newUser)
        doctor.createUser(newUser, (err, data) => {
            if (err) throw err;
            console.log(data);
        });
        req.flash('success', 'You are now registered!!!')
        //res.location('/docLogin');
        res.redirect('/users/docLogin');
    }
});

router.get('/docHome',(req,res,next)=>{
    res.render('docHome', { title: 'Doctor Home'});
})
var prediction={};
// router.post('/prediction',(req,res,next)=>{
//     var name = req.body.name;
//     var phone = req.body.phone;
//     var symptoms = req.body.symptoms;
//     var newData = new comm({
//         patientName: name,
//         patientPhone: phone,
//         symptoms: symptoms
//     }); 
//     console.log("newData is :")
//     console.log(newData)
//     comm.createData(newdata, (err, data) => {
//             if (err) throw err;
//             console.log(data);
//         });
//     req.flash('success', 'Data Sent!')
//     res.render('/');
//     // console.log("req.body is :")
//     // prediction = req.body;
//     // console.log(prediction);
//     // res.flash('success','success')
// })
router.post('/prediction',(req,res,next)=>{
    var data = [];
    data = req.body;
    console.log(data);
    var newData = new comm({
        symptoms: data
    })
    comm.createData(newData,(err,data)=>{
        if(err) throw err;
        console.log(data);
    })
    res.send('ok');
})

router.get('/prediction',(req,res)=>{
    res.render('prediction', { title: 'Prediction', data:prediction });
})


router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success', 'You have successfully logged out');
    res.redirect('/users/login');
});
router.post('/index',(req,res)=>{

})


module.exports = router;