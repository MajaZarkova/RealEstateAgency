function isUser() {
    return function (req, res, next) {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/login');
        }
    }
}

function isGuest() {
    return function (req, res, next) {
        if (req.session.user) {
            res.redirect('/');
        } else {
            next();
        }
    }
}

function isOwner() {
    return function (req, res, next) {
        const userId = req.session.user?._id;
        const collection = res.locals.housing;

        if (userId == collection.owner) {
            next();
        } else {
            res.redirect('/login');
        }
    }
}

module.exports = {
    isUser,
    isGuest,
    isOwner
}