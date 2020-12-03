const moment = require("moment");

const Comment = require("../../database/models/comment.js");
const { formatDoc, getDocs, getDoc, postDoc, buildRegexList, getReqPath, hash } = require("./generalController");
const { getThread } = require("./threadController");

const commentParams = ["_id", "content", "position", "date", "threadId", "userId"];

const buildPipeline = (req, query) => {
	const queryPipe = [{ $match: query }];

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

	let pipeline = [...queryPipe];

	if (req.query.groupByThread) {
		pipeline = [...pipeline, ...groupPipe];
	}
	if (req.query.country || req.query.subforum) {
		pipeline = [...pipeline, ...threadPipe];
		if (req.query.country) {
			pipeline = [...pipeline,
				{
					$match: {
						$or: buildRegexList(req.query.country, "thread.country")
					}
				}
			];
		}

		if (req.query.subforum) {
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
		pipeline = [...pipeline, { $sample: { size: parseInt(req.query.random) } }];
	}

	return pipeline;
};

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

const getComments = (req, res) => {
	const query = buildQuery(req);
	if (req.query.groupByThread || req.query.country || req.query.subforum || req.query.random) {
		let limit = (req.query.limit ? parseInt(req.query.limit) : 250);
		limit = (req.query.random ? parseInt(req.query.random) : limit);

		Comment.aggregate(buildPipeline(req, query))
			.limit(limit)
			.then(results => {
				res.send(formatDoc(results, "comment", commentParams, getReqPath(req)));
			})
			.catch(error => {
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
		return getDocs(req, res, Comment, (results, reqPath) => formatDoc(results, "comment", commentParams, reqPath), query);
	}
};
exports.getComments = getComments;

const getComment = (req, res) => getDoc(req, res, Comment, (results, reqPath) => formatDoc(results, "comment", commentParams, reqPath));
exports.getComment = getComment;

exports.postComment = (req, res) => {
	const user = req.body.user;
	const comment = req.body.comment;
	const threadId = req.body.threadId;

	// 10:22 UTC 13 Apr 2020
	const date = moment().format("hh:mm [UTC] dd MMM YYYY").toString();

	const reqCopy = req;
	reqCopy.query = {
		thread: threadId,
		limit: 100000
	};

	const statusCallback = thisRes => code => {
		if (code >= 300) {
			res.status(code);
			thisRes.send = data => {
				res.send(data);
			};
		}
		return thisRes;
	};

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
