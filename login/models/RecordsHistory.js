const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

//use login
//db.prescriptionhistories.find()

const recordSchema = new mongoose.Schema({
  userId: String,
  date: Date,
  doctor: String,
  
  healthprofile: {
    allergy: String,
    medication: String,
    illness: String,
  },

  history: {
    hives : String, 
    bowel : String,
    thyroid : String, 
    liver : String,
    diabetes : String, 
    stomach : String,
    pneumonia : String, 
    acid : String,
    tb : String, 
    anemia : String,
    stroke : String,
    bronchitis : String, 
    bleeding : String,
    emphysema : String, 
    cancer : String,
    lung : String, 
    neuro : String,
    strep : String, 
    seizures : String,
    sleep : String, 
    headaches : String,
    cpap : String, 
    cataracts : String,
    arrhythmia : String, 
    glaucoma : String,
    heart : String, 
    arthritis : String,
    bp : String, 
    spine : String,
    cholesterol : String, 
    osteoporosis : String,
    hepatitis : String, 
    depression : String,
    hiv : String, 
    anxiety : String,
    kidney : String, 
    psych : String,
    gyn : String, 
    prostate: String,
    drugs : String
  },

  family: {
    asthma: String,
    sinus: String,
    hayfever: String,
    cysticfibrosis: String,
    emphysema: String,
    thyroid: String,
    heart: String,
    diabetes: String,
    cancer: String
  },
}, { timestamps: true });


const Record = mongoose.model('RecordHistory', recordSchema);

module.exports = Record;
