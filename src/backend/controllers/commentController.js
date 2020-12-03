// Brennan Wilkes

// Imports
const moment = require("moment");

const Comment = require("../../database/models/comment.js");
const { formatDoc, getDocs, getDoc, postDoc, buildRegexList, getReqPath, hash } = require("./generalController");
const { getThread } = require("./threadController");

/**
 * Expected return params of mongo Comment
 */
const commentParams = ["_id", "content", "position", "date", "threadId", "userId"];

/**
 * Builds an aggregation pipeline for advanced comment search
 * @param {object} req
 * @param {object} query Search filters
 * @returns aggregation pipeline
 */
const buildPipeline = (req, query) => {
	/// Basic filter match
	const queryPipe = [{ $match: query }];

	// Thread join
	const groupPipe = [
		{
			$group: {
				_id: "$threadId",
				doc: { $first: "$$ROOT" }
			}
		},
		{
			$replaceRoot: {
				newRoot: "$doc"
			}
		}
	];

	// Thread search
	const threadPipe = [
		{
			$lookup: {
				from: "threads",
				let: {
					threadId: "$threadId"
				},
				pipeline: [
					{
						$match: {
							$expr: {
								$and: [
									{ $eq: ["$_id", "$$threadId"] }
								]
							}
						}
					}
				],
				as: "thread"
			}
		}
	];

	// Initialize pipeline
	let pipeline = [...queryPipe];

	// Apply group filters
	if (req.query.groupByThread) {
		pipeline = [...pipeline, ...groupPipe];
	}
	if (req.query.country || req.query.subforum) {
		// Apply thread pipeline
		pipeline = [...pipeline, ...threadPipe];
		if (req.query.country) {
			// Apply country specific regex
			pipeline = [...pipeline,
				{
					$match: {
						$or: buildRegexList(req.query.country, "thread.country")
					}
				}
			];
		}

		if (req.query.subforum) {
			// Apply subofurm specific regex
			pipeline = [...pipeline,
				{
					$match: {
						$or: buildRegexList(req.query.subforum, "thread.subforum")
					}
				}
			];
		}
	}
	if (req.query.random) {
		// Apply random sampling
		pipeline = [...pipeline, { $sample: { size: parseInt(req.query.random) } }];
	}

	return pipeline;
};

/**
 * Builds a comment search query
 * @param {object} req
 * @returns {object} Mongo filter object
 */
const buildQuery = req => {
	const query = {};

	if (req.query.thread) {
		query.threadId = req.query.thread;
	}
	if (req.query.user) {
		query.userId = req.query.user;
	}
	if (req.query.search) {
		query.$and = buildRegexList(req.query.search, "content");
	}

	return query;
};

/**
 * GET route for comments
 * Determines if search is basic or advanced and routes accordingly
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
const getComments = (req, res) => {
	// Build basic search query
	const query = buildQuery(req);

	// Determine search complexity
	if (req.query.groupByThread || req.query.country || req.query.subforum || req.query.random) {
		// Apply limit
		let limit = (req.query.limit ? parseInt(req.query.limit) : 250);
		limit = (req.query.random ? parseInt(req.query.random) : limit);

		// Advanced query by specific aggregation pipeline
		Comment.aggregate(buildPipeline(req, query))
			.limit(limit)
			.then(results => {
				res.send(formatDoc(results, "comment", commentParams, getReqPath(req)));
			})
			.catch(error => {
				// Mongo is slow :(
				if (error.codeName === "MaxTimeMSExpired") {
					res.status(200).send({
						comments: [],
						errors: ["Maximum timeout exceeded. Likely no results"]
					});
				} else {
					res.status(500).send(error);
				}
			});
	} else {
		// Basic general query
		return getDocs(req, res, Comment, (results, reqPath) => formatDoc(results, "comment", commentParams, reqPath), query);
	}
};
exports.getComments = getComments;

const getComment = (req, res) => getDoc(req, res, Comment, (results, reqPath) => formatDoc(results, "comment", commentParams, reqPath));
exports.getComment = getComment;

/**
 * POST Route for comments
 * @param {object} req
 * @param {object} res
 */
exports.postComment = (req, res) => {
	// Capture relevent data
	const user = req.body.user;
	const comment = req.body.comment;
	const threadId = req.body.threadId;

	// Caputre current date/time in format:
	//				10:22 UTC 13 Apr 2020
	const date = moment().format("hh:mm [UTC] dd MMM YYYY").toString();

	// Copy request object
	const reqCopy = req;
	reqCopy.query = {
		thread: threadId,
		limit: 100000
	};

	// Generates mock routing objects
	const statusCallback = thisRes => code => {
		if (code >= 300) {
			res.status(code);
			thisRes.send = data => {
				res.send(data);
			};
		}
		return thisRes;
	};

	// Mock a re-route through GET routes
	// This is used to correctly retrieve additional required
	// information and abstract the return response handling
	// away from the POST handler
	const mockResComments = {
		status: statusCallback(this),
		send: data => {
			const pos = data.comments.length;

			const mockResThread = {
				status: statusCallback(this),
				send: data => {
					const threadTitle = data.threads[0].title;
					const sanitySearch = { _id: hash(`${hash(user)}${date}${threadTitle}`) };
					const dataToInsert = {
						_id: hash(`${hash(user)}${date}${threadTitle}`),
						userId: hash(user),
						threadId: threadId,
						date: date,
						position: String(pos),
						content: comment
					};
					postDoc(req, res, Comment, sanitySearch, dataToInsert, getComment);
				}
			};

			reqCopy.query = {};
			reqCopy.params = { id: data.comments[0].threadId };
			getThread(reqCopy, mockResThread);
		}
	};

	getComments(reqCopy, mockResComments);
};
