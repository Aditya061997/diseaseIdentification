var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');


mongoose.connect('mongodb://identification:identify123@ds151222.mlab.com:51222/disease_identification');

var db = mongoose.connection;

var data = mongoose.Schema({
	symptoms:{}
	
});

var comm = module.exports = mongoose.model('comm',data);
module.exports.createData = (newData,callback)=>{
	console.log("in createData")
	newData.save(callback);
}