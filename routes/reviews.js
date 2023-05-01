const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../helpers/catchAsync');
const { validateReview, isLoggedIn, isReviewUser } = require('../middlewear.js');
const reviews = require('../controllers/reviews');
// Routes ---->

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewUser, catchAsync(reviews.deleteReview));

module.exports = router;