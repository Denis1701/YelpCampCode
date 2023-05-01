const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/deaxomdp2/image/upload/v1682598044/YelpCamp/yflie1tx0kygdjh5bovb.jpg',
                    filename: 'YelpCamp/tummqjnnzn00lmuflzc5'
                }
            ]
            ,
            price,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui non soluta aliquid ut et dolores officiis id veritatis doloremque nostrum quaerat dignissimos voluptas, quidem officia, eius perferendis? Tenetur, natus quidem!',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            user: '643d4bab32be0542247614b5'
        })
        await camp.save();
    }
}

seedDB().then(() => {//return a promise since it's async function - after finishing the saving to the database closing the connection
    mongoose.connection.close();
})