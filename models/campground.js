const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const campgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    images: {
        type: [ImageSchema],
        validate: [arrayLimit, 'At least one image is required']
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

function arrayLimit(val) {
    return val.length > 0;
}

module.exports = mongoose.model('Campground', campgroundSchema);
