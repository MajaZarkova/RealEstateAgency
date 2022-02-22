const housingService = require('../services/housingService');

function preload() {
    return async function (req, res, next) {
        const id = req.params.id;
        const data = await housingService.getOneHousing(id);
        res.locals.housing = data;

        next();
    }
}

module.exports = preload;