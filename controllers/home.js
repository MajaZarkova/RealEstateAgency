const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { getLastThree, getSearchHousings } = require('../services/housingService');

router.get('/', async (req, res) => {
    const housings = await getLastThree();

    res.render('home', { title: 'Home Page', housings });
});

router.get('/search', (req, res) => {
    res.render('search', { title: 'Search Page' });
})

router.post('/search', isUser(), async (req, res) => {
    const type = req.body.type;
    const housings = await getSearchHousings(type);
    res.render('search', { title: 'Search Page', housings })
})

module.exports = router;