const express = require('express');
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')

const db = require('../db/models')
const { csrfProtection, asyncHandler } = require('./utils')

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', csrfProtection, (req, res, next) => {
  const user = db.User.build();
  res.render('signup', {
    title: 'Sign Up',
    user,
    csrfToken: req.csrfToken()
  })
})

const userValidators = [
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for First Name')
    .isLength({ max: 50 })
    .withMessage('First Name must not be more than 50 characters long'),

  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Last Name')
    .isLength({ max: 50 })
    .withMessage('Last Name must not be more than 50 characters long'),

  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email')
    .isLength({ max: 255 })
    .withMessage('Email Address must not be more than 255 characters long')
    .isEmail()
    .withMessage('Email Address is not a valid email')
    .custom((value) => {
      return db.User.findOne({ where: { emailAddress: value } })
        .then((user) => {
          if (user) {
            return Promise.reject('The provided Email Address is already in use by another account');
          }
        })}),

  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Username')
    .isLength({ max: 50 })
    .withMessage('Last Name must not be more than 50 characters long')
    .custom((value) => {
      return db.User.findOne({ where: { username: value } })
        .then((user) => {
          if (user) {
            return Promise.reject('The provided Username is already in use by another account')
          }
        })}),

  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password')
    .isLength({ min: 8})
    .withMessage('Password must be at least 8 characters long')
    .isLength({ max: 50 })
    .withMessage('Password must not be more than 50 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
    .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")')
]

router.post('/signup', csrfProtection, userValidators, asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    username,
    password
  } = req.body

  const user = db.User.build({
    firstName,
    lastName,
    email,
    username,
  })

  const validatorErrors = validationResult(req)

  if (validatorErrors.isEmpty()) {
    user.hashedPassword = await bcrypt.hash(password, 10);
    await user.save();
    res.redirect('/') //TODO change redirect to application
  } else {
    const errors = validatorErrors.array().map((error) => error.msg);
    res.render('signup', {
      title: 'Sign Up',
      user,
      errors,
      csrfToken: req.csrfToken(),
    })
  }
}))

module.exports = router;
