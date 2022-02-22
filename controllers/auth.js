const router = require('express').Router();
const { isGuest, isUser } = require('../middleware/guards');
const { register, login } = require('../services/userService');
const mapErrors = require('../util/mapper');

router.get('/register', isGuest(), (req, res) => {
    res.render('register', { title: 'Register Page' });
});

router.post('/register', isGuest(), async (req, res) => {
    const { name, username, password, repass } = req.body;

    try {
        if (username == '' || password.length < 4) {
            throw new Error('Username is required and password must be at least 4 characters');
        }

        if (password != repass) {
            throw new Error('Passwords don\'t match');
        }

        const user = await register(name, username, password);
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        const errors = mapErrors(err);
        res.render('register', { title: 'Register Page', data: { username: username, name: name }, errors })
    }
});

router.get('/login', isGuest(), (req, res) => {
    res.render('login', { title: 'Login Page' })
});

router.post('/login', isGuest(), async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await login(username, password);
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        const errors = mapErrors(err);
        res.render('login', { title: 'Login Page', data: { username: username }, errors })
    }
});

router.get('/logout', isUser(), (req, res) => {
    delete req.session.user;
    res.redirect('/');
})

module.exports = router;