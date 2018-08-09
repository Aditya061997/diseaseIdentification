var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


mongoose.connect('mongodb://identification:identify123@ds151222.mlab.com:51222/disease_identification');

var db = mongoose.connection;

var doctorSchema = mongoose.Schema({
	username:{
		type: String,
	},
	password:{
		type: String
	},
	speciality:{
		type: String
	},
	email:{
		type: String
	},
	name:{
		type: String
	}
});

var doctor = module.exports = mongoose.model('doctor',doctorSchema);

module.exports.getUserById = (id,callback)=>{
	doctor.findById(id, callback);
}

module.exports.getUserByUsername = (username, callback)=>{
	console.log("in doctors getUserByUsername");
	var query = {username: username};
	doctor.findOne(query, (callback));
}

module.exports.comparePasswords = (candidatePassword,hash,callback)=>{
	console.log("in doctors comparePasswords");
	bcrypt.compare(candidatePassword, hash, (err,isMatch)=>{
		callback(err, isMatch);
	});
}

module.exports.createUser = (newUser,callback)=>{
	console.log("in doctors createUser")
	bcrypt.genSalt(10,(err,salt)=>{
		bcrypt.hash(newUser.password,salt,(err,hash)=>{
			newUser.password = hash;
			newUser.save(callback);

		});
	});
}

module.exports.getUserNames = (callback)=>{
	doctor.find({},(callback)).sort({"username":1});
	
}