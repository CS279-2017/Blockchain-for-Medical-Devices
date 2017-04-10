const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

//use login
//db.prescriptionhistories.find()

const prescriptionSchema = new mongoose.Schema({
  userId: String,
  date: Date,
  doctor: String,
  medication: String,
  description: String
}, { timestamps: true });


const Prescription = mongoose.model('PrescriptionHistory', prescriptionSchema);

module.exports = Prescription;
