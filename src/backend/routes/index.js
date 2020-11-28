const router = require('express').Router();

const commentRouter = require('./comments.js');
const userRouter = require('./users.js');
const threadRouter = require('./threads.js');

router.get('/', (req,res) => {
	res.send("todo");
});

router.use('/comments', commentRouter);
router.use('/users', userRouter);
router.use('/threads', threadRouter);

module.exports = router;
