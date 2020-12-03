// Brennan Wilkes

// Imports
const router = require("express").Router();

// Route requests to correct routers
router.use("/comments", require("./comments.js"));
router.use("/users", require("./users.js"));
router.use("/threads", require("./threads.js"));

module.exports = router;
