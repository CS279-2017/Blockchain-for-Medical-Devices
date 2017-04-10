const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

//use login
//db.prescriptionhistories.find()

const symptomSchema = new mongoose.Schema({
  userId: String,
  date: Date,
  doctor: String,
  description: String
}, { timestamps: true });


const Symptom = mongoose.model('SymptomHistory', symptomSchema);

module.exports = Symptom;
