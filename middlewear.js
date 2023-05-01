const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./helpers/ExpressErrors.js');
const Campground = require('./models/campground.js');
const Review = require('./models/review.js');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //Store the URL the user requested in order to come back after he logged in
        req.session.userViewed = req.originalUrl;
        req.flash('error', 'You must be signed first!!!!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isUser = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.user.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!!!');
        return res.redirect(`/campgrounds/${id}`);
    } else {
        next();
    }
}
module.exports.isReviewUser = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.user.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!!!');
        return res.redirect(`/campgrounds/${id}`);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};