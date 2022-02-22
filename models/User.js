const { Schema, model } = require('mongoose');
const NAME_PATTERN = /^[A-Za-z-]+ [A-Za-z-]+$/;
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator(value) {
                return NAME_PATTERN.test(value);
            },
            message: 'Name should be in following format: (firstname lastname)'
        }
    },
    username: { type: String, required: true, minlength: [5, 'The username should be at least 5 characters long'] },
    hashedPassword: { type: String, required: [true, 'Password is required'] }
});

userSchema.index({ username: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);
module.exports = User;