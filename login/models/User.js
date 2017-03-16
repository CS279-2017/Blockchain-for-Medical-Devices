const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  //true if patient, false if doctor
  patient: Boolean,
  name: String,

  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  steam: String,
  tokens: Array,

  doctor_profile: {
    hospital: String,
    phone: String
  },

  doctor_prescription: {
    filled: String
  },

////////////
  profile: {
    gender: String,
    location: String,
    website: String,
    picture: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    dob: String,
    ssn: String,
    primary: String
  },

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

  prescription: {
    doctor: String,
    medication: String,
    description: String
  },
  
  symptoms: {
    doctor: String,
    description: String
  }

}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
