var mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;


mongoose.connect('mongodb://identification:identify123@ds151222.mlab.com:51222/disease_identification');

var db = mongoose.connection;

module.exports.getParticularData = (filter,callback)=>{
	db.collection("sub_symptoms").distinct(filter,callback)
}

