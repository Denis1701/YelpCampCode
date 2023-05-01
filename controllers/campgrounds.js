const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async (req, res) => {//Campground GET
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
};

module.exports.renderNewForm = (req, res) => {//New Campground FORM
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {//Campground POST
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));//Loop Over the array of images in the files and take filename && path(URL) to store in the Campground -> images.
    campground.user = req.user._id;
    await campground.save();
    req.flash('success', 'Campground has been made');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {//Find Campground by id
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'user'
        }
    }).populate('user');
    if (!campground) {
        req.flash('error', "Campground hasn't been found");
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {//edit campground FORM
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find this campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {//Campground PUT
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);//Loop Over the array of images in the files and take filename && path(URL) to store in the Campground -> images.
    await campground.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: { $in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Campground has been updated');
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground has been deleted');
    res.redirect('/campgrounds');
};