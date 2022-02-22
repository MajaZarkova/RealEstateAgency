const { Schema, model, Types: { ObjectId } } = require('mongoose');
const NAME_PATTERN = /^[A-Za-z-]+ [A-Za-z-]+$/;
const IMAGE_PATTERN = /^https?:\/\/(.+)/;
const housingSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: [6, 'Name should be at least 6 characters']
    },
    type: { type: String, required: true },
    year: { type: Number, required: [true, 'Year is required'], min: 1850, max: 2021 },
    city: { type: String, required: true, minlength: [4, 'City should be at least 4 characters long'] },
    homeImg: {
        type: String,
        required: true,
        validate: {
            validator(value) {
                return IMAGE_PATTERN.test(value);
            },
            message: 'Home Image should starts with http:// or https://'
        }
    },
    description: { type: String, required: true, maxlength: [60, 'Property Description should be a maximum of 60 characters long'] },
    availablePcs: { type: Number, required: true, min: 0, max: [10, 'Available Pieces should be positive number (from 0 to 10)'] },
    rentedBy: { type: [ObjectId], ref: 'User', default: [] },
    owner: { type: ObjectId, ref: 'User' }
});

const Housing = model('Housing', housingSchema);
module.exports = Housing;