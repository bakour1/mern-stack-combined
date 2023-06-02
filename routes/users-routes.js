const express = require('express');
const HttpError = require('../models/http-error');

const router = express.Router();
const usersController = require('../controller/users-controllers');
const { check } = require('express-validator');
const fileUpload = require('../middleware/file-upload');

//  /api/users
router.get('/', usersController.getUsers);

//  /api/users/signup
router.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })
  ],
  usersController.signup
);

//  /api/users/login
router.post('/login', usersController.login);

module.exports = router;
