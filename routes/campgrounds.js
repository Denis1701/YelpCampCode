const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const { isLoggedIn, validateCampground, isUser } = require('../middlewear.js');
const campgrounds = require('../controllers/campgrounds');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// Routes ---->
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);//Have to go before /:id because it's thinking that new is an id!!!!!!!!!

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isUser, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isUser, catchAsync(campgrounds.deleteCampground));


router.get('/:id/edit', isLoggedIn, isUser, catchAsync(campgrounds.renderEditForm));

module.exports = router; 