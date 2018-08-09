var mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;


mongoose.connect('mongodb://identification:identify123@ds151222.mlab.com:51222/disease_identification');

var db = mongoose.connection;
var userId = "";

var symptoms = mongoose.Schema({
    symptom:[String],
});

var symptom = module.exports = mongoose.model('symptom',symptoms);

module.exports.createData=(newData,callback)=>{

	newData.save(callback);
}

module.exports.getData=(callback)=>{
    symptom.find({},(callback))
}