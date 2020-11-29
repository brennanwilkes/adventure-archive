const Thread = require('../../database/models/thread.js');
const {formatDoc, getDocs, getDoc, postDoc} = require("./generalController");

const threadParams = ["_id", "title", "country", "subforum"];

exports.getThreads = (req, res) => getDocs(req, res, Thread, results => formatDoc(results, "thread", threadParams));

exports.getThread = (req, res) => getDoc(req, res, Thread, results => formatDoc(results, "thread", threadParams))

exports.postThread = (req, res) => postDoc(req, res);
