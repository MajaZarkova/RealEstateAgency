const Housing = require('../models/Housing');

async function createHousing(data) {
    const housing = new Housing(data);
    await housing.save();
    return housing;
}

async function getHousings() {
    const housings = await Housing.find({}).lean();

    return housings;
}

async function getSearchHousings(search) {
    const options = {}
    options.type = { $regex: search, $options: 'i' }
    const housings = await Housing.find(options).lean();

    return housings;
}

async function getOneHousing(id) {
    const housing = await Housing.findById(id).populate('rentedBy', 'name').lean();

    if (housing) {
        return housing;
    } else {
        throw new Error('Housing doesn\'t exist');
    }
}

async function editHousing(id, data) {
    await Housing.findByIdAndUpdate(id, data, { runValidators: true });
}

async function deleteHousing(id) {
    await Housing.findByIdAndDelete(id);
}

async function rent(id, userId) {
    const housing = await Housing.findById(id);

    if (housing.rentedBy.includes(userId)) {
        throw new Error('User already rented this property!');
    }

    housing.rentedBy.push(userId);
    housing.availablePcs--;
    await housing.save();
}

async function getLastThree() {
    const result = await Housing.find({}).sort({ _id: -1 }).limit(3).lean();
    return result;
}

module.exports = {
    createHousing,
    getHousings,
    getOneHousing,
    editHousing,
    deleteHousing,
    rent,
    getLastThree,
    getSearchHousings
}