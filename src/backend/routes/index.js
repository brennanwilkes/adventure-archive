const router = require('express').Router();

router.use('/comments', require('./comments.js'));
router.use('/users', require('./users.js'));
router.use('/threads', require('./threads.js'));

module.exports = router;
