const router = require('express').Router();
const { isUser, isOwner } = require('../middleware/guards');
const preload = require('../middleware/preload');
const { getHousings, createHousing, editHousing, deleteHousing, rent } = require('../services/housingService');
const mapErrors = require('../util/mapper');

router.get('/housing', async (req, res) => {
    const housings = await getHousings();
    res.render('housings', { title: 'Housing Page', housings });
});

router.get('/create', isUser(), (req, res) => {
    res.render('create', { title: 'Create Housing' });
});

router.post('/create', isUser(), async (req, res) => {
    const housing = {
        name: req.body.name,
        type: req.body.type,
        year: req.body.year,
        city: req.body.city,
        homeImg: req.body.homeImg,
        description: req.body.description,
        availablePcs: req.body.availablePcs,
        owner: req.session.user._id
    }

    try {
        await createHousing(housing);
        res.redirect('/housing');
    } catch (error) {
        const errors = mapErrors(error);
        res.render('create', { title: 'Create Housing', housing, errors });
    }
});

router.get('/details/:id', preload(), (req, res) => {
    res.locals.housing.hasUser = res.locals.hasUser;
    res.locals.housing.isOwner = res.locals.housing.owner == req.session.user?._id;
    res.locals.housing.hasRented = res.locals.housing.rentedBy.find(x => x._id == req.session.user?._id) != undefined;
    res.locals.housing.rentedBy = res.locals.housing.rentedBy.map(x => x.name).join(', ');
    res.locals.housing.hasPcs = res.locals.housing.availablePcs > 0;

    res.render('details', { title: 'Details Page' });
});

router.get('/edit/:id', isUser(), preload(), isOwner(), (req, res) => {
    res.render('edit', { title: 'Edit Housing' });
});

router.post('/edit/:id', isUser(), preload(), isOwner(), async (req, res) => {
    const id = req.params.id;
    const housing = {
        name: req.body.name,
        type: req.body.type,
        year: req.body.year,
        city: req.body.city,
        homeImg: req.body.homeImg,
        description: req.body.description,
        availablePcs: req.body.availablePcs,
    }

    console.log(id);
    console.log(housing);

    try {
        await editHousing(id, housing);
        res.redirect(`/details/${id}`);
    } catch (error) {
        const errors = mapErrors(error);
        housing._id = id;
        res.render('create', { title: 'Create Housing', housing, errors });
    }
});

router.get('/delete/:id', isUser(), preload(), isOwner(), async (req, res) => {
    await deleteHousing(req.params.id);
    res.redirect('/housing')
});

router.get('/rent/:id', isUser(), async (req, res) => {
    const id = req.params.id;
    const userId = req.session.user._id;

    try {
        await rent(id, userId);
        res.redirect(`/details/${id}`);
    } catch (error) {
        const errors = mapErrors(error);
        res.redirect(`/details/${id}`);
    }
});

module.exports = router;