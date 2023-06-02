const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const placesControllers = require('../controller/places-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

//  /api/places/placeId
router.get('/:pid', placesControllers.getPlaceById);

//  /api/places/user/userId
router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.use(checkAuth);

//  /api/places
router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty()
  ],
  placesControllers.createPlace
);

//  /api/places/placeId
router.patch(
  '/:pid',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  placesControllers.updatePlace
);

//  /api/places/placeId
router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
