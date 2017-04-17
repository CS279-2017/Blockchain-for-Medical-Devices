const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');

const Prescription = require('../models/PrescriptionHistory');
const Symptom = require('../models/SymptomHistory');
const Record = require('../models/RecordsHistory');

var patient_names = User.find({$and:[{"name":{$exists:true}},{"patient":true}]});
var patient_symptoms = User.find({$and:[{"name":{$exists:true}},{"patient":true}]});

/**
 * GET /fill_prescription
 * fill prescription page.
 */
exports.getFillPrescription = (req, res) => {
  User.find({$and:[{"name":{$exists:true}},{"patient":true}]},function(err, patient_names){
    res.render('account/fill_prescription', {
      title: 'Fill A Prescription',
      patient_names:patient_names
    });
  });
};

/**
 * POST /account/prescription
 * symptoms information.
 */
exports.postFillPrescription = (req, res, next) => {
  if(req.body.btype == "approve"){
    req.flash('success', { msg: 'The prescription has been sent to the nearest pharmacy.' });
    User.find({$and:[{"name":{$exists:true}},{"patient":true}]},function(err, patient_names){
    res.render('account/fill_prescription', {
      title: 'Fill A Prescription',
      patient_names:patient_names
    });
  });
  } else {
  User.find({$and:[{"name":req.body.patientName},{"patient":true}]},function(err,patient_prescription){
    Prescription.find({"userId":patient_prescription[0].id},function(err,past_prescription){
      res.render('account/patient_prescription_page', {
        title: 'Fill Patient Prescription',
        patient_prescription:patient_prescription,
        past_prescription: past_prescription
      });
    });
  });
}
};


/**
 * POST /account/prescription
 * symptoms information.
 */

exports.postPastPrescriptions = (req, res, next) => {
    User.find({$and:[{"name":req.body.patientName},{"patient":true}]},function(err,patient_prescription){
      Prescription.find({$and:[{"userId":patient_prescription[0].id},{"date":req.body.date}]}, function(err,past_prescription){
        res.render('account/past_prescription', {
          title: 'Past Patient Prescription',
          patient_prescription:patient_prescription,
          past_prescription: past_prescription
        });
      });
    });
};

/**
 * POST /account/prescription
 * symptoms information.
 */
exports.postPastSymptoms = (req, res, next) => {
  User.find({$and:[{"name":req.body.patientName},{"patient":true}]},function(err,patient_symptoms){
      Symptom.find({$and:[{"userId":patient_symptoms[0].id},{"date":req.body.date}]}, function(err,past_symptoms){
      res.render('account/past_symptoms', {
        title: 'Past Patient Symptoms',
        patient_symptoms:patient_symptoms,
        past_symptoms: past_symptoms
      });
    });
  });
};

/**
 * GET /view_symptoms
 * view patient symptoms page.
 */
exports.getViewSymptoms = (req, res) => {
  User.find({$and:[{"name":{$exists:true}},{"patient":true}]},function(err, patient_names){
    res.render('account/view_symptoms', {
      title: 'View Symptoms',
      patient_names:patient_names
    });
  });
};

/**
 * POST /account/symptoms
 * symptoms information.
 */
exports.postViewSymptoms = (req, res, next) => {
  console.log(req.body.patientName);
  User.find({$and:[{"name":req.body.patientName},{"patient":true}]},function(err,patient_symptoms){
      Symptom.find({"userId":patient_symptoms[0].id},function(err,past_symptoms){
      res.render('account/patient_symptoms_page', {
        title: 'See Patient Symptoms',
        patient_symptoms:patient_symptoms,
        past_symptoms: past_symptoms
      });
    });
  });
};

/**
 * GET /view_patient_records
 * report page.
 */
exports.getViewPatientRecords = (req, res) => {
  User.find({$and:[{"name":{$exists:true}},{"patient":true}]},function(err, patient_names){
    res.render('account/view_patient_records', {
      title: 'View Patient Records',
      patient_names:patient_names
    });
  });
};

/**
 * POST /account/symptoms
 * symptoms information.
 */
exports.postViewPatientRecords = (req, res, next) => {
  User.find({$and:[{"name":req.body.patientName},{"patient":true}]},function(err,patient_record){
      Record.find({"userId":patient_record[0].id},function(err,past_record){
      res.render('account/patient_profile_page', {
        title: 'See Patient Record',
        patient_record:patient_record,
        past_record: past_record
      });
    });
  });
};

/**
 * POST /account/prescription
 * symptoms information.
 */
exports.postPastRecord = (req, res, next) => {
  User.find({$and:[{"name":req.body.patientName},{"patient":true}]},function(err,patient_record){
      Record.find({$and:[{"userId":patient_record[0].id},{"date":req.body.date}]}, function(err,past_record){
      res.render('account/past_record', {
        title: 'Past Patient Record',
        patient_record:patient_record,
        past_record: past_record
      });
    });
  });
};

/**
 * GET /report
 * report page.
 */
exports.getReport = (req, res) => {
  res.render('account/report', {
    title: 'Report'
  });
};

/**
 * GET /symptoms
 * report page.
 */
exports.getSymptoms = (req, res) => {
  res.render('account/symptoms', {
    title: 'Report Symptoms'
  });
};

/**
 * POST /account/symptoms
 * symptoms information.
 */
exports.postSymptoms = (req, res, next) => {

  const symptom = new Symptom({
    userId: req.user.id,
    date: Date.now(),
    doctor: req.body.doctor,
    description: req.body.description
  });

  symptom.save(function(err,symptom){
      if(err) { return console.error(err); }
      console.log("success");
  });

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.symptoms.doctor = req.body.doctor || '';
    user.symptoms.description = req.body.description || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was something wrong with the information you entered.' });
          return res.redirect('/symptoms');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Your symptoms have been received.' });
      res.redirect('/symptoms');
    });
  });
};

/**
 * GET /healthprofile
 * profile page.
 */
exports.getHealthProfile = (req, res) => {
  res.render('account/healthprofile', {
    title: 'Health Profile'
  });
};

/**
 * POST /account/healthprofile
 * Update healthprofile information.
 */
exports.postUpdateHealthProfile = (req, res, next) => {

  const record = new Record({
    userId: req.user.id,
    date: Date.now(),
    healthprofile: {
      allergy : req.body.allergy || '',
      medication : req.body.medication || '',
      illness : req.body.illness || ''
    },
    
    history: {
      hives : req.body.hives || '', 
      bowel : req.body.bowel || '',
      thyroid : req.body.thyroid || '', 
      liver : req.body.liver || '',
      diabetes : req.body.diabetes || '', 
      stomach : req.body.stomach || '',
      pneumonia : req.body.pneumonia || '', 
      acid : req.body.acid || '',
      tb : req.body.tb || '', 
      anemia : req.body.anemia || '',
      stroke : req.body.stroke || '',
      bronchitis : req.body.bronchitis || '', 
      bleeding : req.body.bleeding || '',
      emphysema : req.body.emphysema || '', 
      cancer : req.body.cancer || '',
      lung : req.body.lung || '', 
      neuro : req.body.neuro || '',
      strep : req.body.strep || '', 
      seizures : req.body.seizures || '',
      sleep : req.body.sleep || '', 
      headaches : req.body.headaches || '',
      cpap : req.body.cpap || '', 
      cataracts : req.body.cataracts || '',
      arrhythmia : req.body.arrhythmia || '', 
      glaucoma : req.body.glaucoma || '',
      heart : req.body.heart || '', 
      arthritis : req.body.arthritis || '',
      bp : req.body.bp || '', 
      spine : req.body.spine || '',
      cholesterol : req.body.cholesterol || '', 
      osteoporosis : req.body.osteoporosis || '',
      hepatitis : req.body.hepatitis || '', 
      depression : req.body.depression || '',
      hiv : req.body.hiv || '', 
      anxiety : req.body.anxiety || '',
      kidney : req.body.kidney || '', 
      psych : req.body.psych || '',
      gyn : req.body.gyn || '', 
      prostate : req.body.prostate || '',
      drugs : req.body.drugs || ''
    },

    family: {
      asthma : req.body.asthma_family || '',
      sinus : req.body.sinus_family || '',
      hayfever : req.body.hayfever_family || '',
      cysticfibrosis : req.body.cysticfibrosis_family || '',
      emphysema : req.body.emphysema_family || '',
      thyroid : req.body.thyroid_family || '',
      heart : req.body.heart_family || '',
      diabetes : req.body.diabetes_family || '',
      cancer : req.body.cancer_family || ''
    }
  });

  record.save(function(err,record){
      if(err) { return console.error(err); }
      console.log("success");
  });

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.healthprofile.allergy = req.body.allergy || '';
    user.healthprofile.medication = req.body.medication || '';
    user.healthprofile.illness = req.body.illness || '';

    user.history.hives = req.body.hives || ''; 
    user.history.bowel = req.body.bowel || '';
    user.history.thyroid = req.body.thyroid || ''; 
    user.history.liver = req.body.liver || '';
    user.history.diabetes = req.body.diabetes || ''; 
    user.history.stomach = req.body.stomach || '';
    user.history.pneumonia = req.body.pneumonia || ''; 
    user.history.acid = req.body.acid || '';
    user.history.tb = req.body.tb || ''; 
    user.history.anemia = req.body.anemia || '';
    user.history.stroke = req.body.stroke || '';
    user.history.bronchitis = req.body.bronchitis || ''; 
    user.history.bleeding = req.body.bleeding || '';
    user.history.emphysema = req.body.emphysema || ''; 
    user.history.cancer = req.body.cancer || '';
    user.history.lung = req.body.lung || ''; 
    user.history.neuro = req.body.neuro || '';
    user.history.strep = req.body.strep || ''; 
    user.history.seizures = req.body.seizures || '';
    user.history.sleep = req.body.sleep || ''; 
    user.history.headaches = req.body.headaches || '';
    user.history.cpap = req.body.cpap || ''; 
    user.history.cataracts = req.body.cataracts || '';
    user.history.arrhythmia = req.body.arrhythmia || ''; 
    user.history.glaucoma = req.body.glaucoma || '';
    user.history.heart = req.body.heart || ''; 
    user.history.arthritis = req.body.arthritis || '';
    user.history.bp = req.body.bp || ''; 
    user.history.spine = req.body.spine || '';
    user.history.cholesterol = req.body.cholesterol || ''; 
    user.history.osteoporosis = req.body.osteoporosis || '';
    user.history.hepatitis = req.body.hepatitis || ''; 
    user.history.depression = req.body.depression || '';
    user.history.hiv = req.body.hiv || ''; 
    user.history.anxiety = req.body.anxiety || '';
    user.history.kidney = req.body.kidney || ''; 
    user.history.psych = req.body.psych || '';
    user.history.gyn = req.body.gyn || ''; 
    user.history.prostate = req.body.prostate || '';
    user.history.drugs = req.body.drugs || '';

    user.family.asthma = req.body.asthma_family || '';
    user.family.sinus = req.body.sinus_family || '';
    user.family.hayfever = req.body.hayfever_family || '';
    user.family.cysticfibrosis = req.body.cysticfibrosis_family || '';
    user.family.emphysema = req.body.emphysema_family || '';
    user.family.thyroid = req.body.thyroid_family || '';
    user.family.heart = req.body.heart_family || '';
    user.family.diabetes = req.body.diabetes_family || '';
    user.family.cancer = req.body.cancer_family || '';
    //add family and history stuff here
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was something wrong with the information you entered.' });
          return res.redirect('/healthprofile');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Health Profile information has been updated.' });
      res.redirect('/healthprofile');
    });
  });
};

/**
 * GET /prescription
 * prescription page.
 */
exports.getPrescription = (req, res) => {
  res.render('account/prescription', {
    title: 'Prescription'
  });
};

/**
 * POST /account/prescription
 * requestion prescription information.
 */
exports.postPrescription = (req, res, next) => {
  console.log(req.user.id);
  const prescription = new Prescription({
    userId: req.user.id,
    date: Date.now(),
  	doctor: req.body.doctor,
  	medication: req.body.medication,
  	description: req.body.description
  });

  prescription.save(function(err,prescription){
  		if(err) { return console.error(err); }
  		console.log("success");
  });

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.prescription.doctor = req.body.doctor || '';
    user.prescription.medication = req.body.medication || '';
    user.prescription.description = req.body.description || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was something wrong with the information you entered.' });
          return res.redirect('/prescription');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Prescription request submitted.' });
      res.redirect('/prescription');
    });
  });
};

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! You are logged in.' });
     // res.redirect(req.session.returnTo || '/');
      res.redirect('/');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    patient: req.body.status,
    name: req.body.name
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/signup');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.email = req.body.email || '';
    user.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    user.profile.address = req.body.address || '';
    user.profile.city = req.body.city || '';
    user.profile.state = req.body.state || '';
    user.profile.zip = req.body.zip || '';
    user.profile.phone = req.body.phone || '';
    user.profile.dob = req.body.dob || '';
    user.profile.ssn = req.body.ssn || '';
    user.profile.primary = req.body.primary || '';
    user.doctor_profile.hospital = req.body.hospital || '';
    user.doctor_profile.phone = req.body.phone || '';

    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
          return res.redirect('/account');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Profile information has been updated.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
  User.remove({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });
    res.redirect('/');
  });
};


/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function resetPassword(done) {
      User
        .findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec((err, user) => {
          if (err) { return next(err); }
          if (!user) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save((err) => {
            if (err) { return next(err); }
            req.logIn(user, (err) => {
              done(err, user);
            });
          });
        });
    },
    function sendResetPasswordEmail(user, done) {
      const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      const mailOptions = {
        to: user.email,
        from: '1234@gmail.com',
        subject: 'Your password has been changed',
        text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
      };
      transporter.sendMail(mailOptions, (err) => {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
        done(err);
      });
    }
  ], (err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  async.waterfall([
    function createRandomToken(done) {
      crypto.randomBytes(16, (err, buf) => {
        const token = buf.toString('hex');
        done(err, token);
      });
    },
    function setRandomToken(token, done) {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
          req.flash('errors', { msg: 'Account with that email address does not exist.' });
          return res.redirect('/forgot');
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        user.save((err) => {
          done(err, token, user);
        });
      });
    },
    function sendForgotPasswordEmail(token, user, done) {
      const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      const mailOptions = {
        to: user.email,
        from: '12345@gmail.com',
        subject: 'Reset your password',
        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
      };
      transporter.sendMail(mailOptions, (err) => {
        req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
        done(err);
      });
    }
  ], (err) => {
    if (err) { return next(err); }
    res.redirect('/forgot');
  });
};
