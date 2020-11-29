const {CONFIG, print, server} = require("./server");
const {mongoose} = require("../database/connection");

const supertest = require('supertest');
const request = supertest(server.app);

CONFIG.verbose = false;
server.init();
server.start();

const idParams = {
	comment: "6.214545011292772e+47",
	user: "9.813252315982051e+47",
	thread: "1.2858713569550184e+48"
}

const testLinkIntegrity = json => {
	expect(Object.keys(json.links[0])).toEqual(expect.arrayContaining([
		"rel",
		"href",
		"action",
		"types"
	]));
}

const testCommentIntegrity = comment => {
	expect(Object.keys(comment)).toEqual(expect.arrayContaining([
		"_id",
		"content",
		"date",
		"position",
		"threadId",
		"userId",
		"links"
	]));
	expect(comment.links.length).toBe(3);
	testLinkIntegrity(comment);
}

const testUserIntegrity = user => {
	expect(Object.keys(user)).toEqual(expect.arrayContaining([
		"_id",
		"name",
		"links"
	]));
	expect(user.links.length).toBe(1);
	testLinkIntegrity(user);
}


const testThreadIntegrity = thread => {
	expect(Object.keys(thread)).toEqual(expect.arrayContaining([
		"_id",
		"subforum",
		"country",
		"title",
		"links"
	]));
	expect(thread.links.length).toBe(1);
	testLinkIntegrity(thread);
}

const testComments = comments => comments.forEach(c => testCommentIntegrity(c));
const testUsers = users => users.forEach(u => testUserIntegrity(u));
const testThreads = threads => threads.forEach(t => testThreadIntegrity(t));

test("Config file integrity", () => {
	const configKeys = Object.keys(CONFIG);
	expect(configKeys).toContain("host");
	expect(configKeys).toContain("verbose");
	expect(configKeys).toContain("api");
	expect(configKeys).toContain("port");
});

test("Server is responding to requests", async done => {
	const res = await request.get("/");
	expect(res.status).toBe(200);
	done();
});

test("Server 404 handling", async done => {
	const res = await request.get("/this/should/not/be/a/valid/url");
	expect(res.status).toBe(404);
	done();
});

let version;
for(let i=-1;i<CONFIG.api.length;i++){

	version = (i<0 ? "" : `v${CONFIG.api[i].version}/`);

	["comment","thread","user"].forEach(endpoint => {

		test(`${endpoint} endpoint responds`, async done => {
			let res = await request.get(`/api/${version}${endpoint}s`);
			expect(res.status >= 200 && res.status <= 299).toBe(true);

			res = await request.get(`/api/${version}${endpoint}s/${idParams[endpoint]}`);
			expect(res.status >= 200 && res.status <= 299).toBe(true);

			res = await request.post(`/api/${version}${endpoint}s`);
			expect(res.status >= 200 && res.status <= 299).toBe(true);

			done();
		});
	});

	test("Get comments resource collection", async done => {
		const res = await request.get(`/api/${version}comments`);

		expect(res.body.comments.length).toBeGreaterThanOrEqual(1);
		testComments(res.body.comments);

		done();
	});

	test("Get specific comment resource", async done => {

		const res = await request.get(`/api/${version}comments/${idParams.comment}`);

		expect(res.body.comments.length).toBe(1);
		testComments(res.body.comments);
		expect(res.body.comments[0]._id).toBe(parseFloat(idParams.comment));

		done();
	});

	test("Get specific comment resource which does not exist", async done => {

		let res = await request.get(`/api/${version}comments/garbage`);
		expect(res.status).toBe(404);
		res = await request.get(`/api/${version}comments/1`);
		expect(res.status).toBe(404);

		done();
	});

	/////////////////////////////

	test("Get users resource collection", async done => {
		const res = await request.get(`/api/${version}users`);

		expect(res.body.users.length).toBeGreaterThanOrEqual(1);
		testUsers(res.body.users);

		done();
	});

	test("Get specific user resource", async done => {

		const res = await request.get(`/api/${version}users/${idParams.user}`);

		expect(res.body.users.length).toBe(1);
		testUsers(res.body.users);
		expect(res.body.users[0]._id).toBe(parseFloat(idParams.user));

		done();
	});

	test("Get specific user resource which does not exist", async done => {

		let res = await request.get(`/api/${version}users/garbage`);
		expect(res.status).toBe(404);
		res = await request.get(`/api/${version}users/1`);
		expect(res.status).toBe(404);

		done();
	});

	/////////////////////////////////////////////

	test("Get threads resource collection", async done => {
		const res = await request.get(`/api/${version}threads`);

		expect(res.body.threads.length).toBeGreaterThanOrEqual(1);
		testThreads(res.body.threads);

		done();
	});

	test("Get specific thread resource", async done => {

		const res = await request.get(`/api/${version}threads/${idParams.thread}`);

		expect(res.body.threads.length).toBe(1);
		testThreads(res.body.threads);
		expect(res.body.threads[0]._id).toBe(parseFloat(idParams.thread));

		done();
	});

	test("Get specific thread resource which does not exist", async done => {

		let res = await request.get(`/api/${version}threads/garbage`);
		expect(res.status).toBe(404);
		res = await request.get(`/api/${version}users/1`);
		expect(res.status).toBe(404);

		done();
	});

}


test("Print integrity", () => {
	console.log = jest.fn();
	CONFIG.verbose = true;
	print("TEST");
	expect(console.log).toHaveBeenCalledWith("TEST");

	console.log = jest.fn();
	CONFIG.verbose = false;
	print("TEST");
	expect(console.log).not.toHaveBeenCalledWith("TEST");
});

afterAll(done => {
	server.close();
	mongoose.connection.close();
	done();
});
