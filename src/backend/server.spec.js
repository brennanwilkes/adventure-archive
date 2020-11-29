const {CONFIG, print, server} = require("./server");
const {mongoose} = require("../database/connection");

const supertest = require('supertest');
const request = supertest(server.app);

CONFIG.verbose = false;
server.init();
server.start();

const idParam = "6.214545011292772e+47";

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
	expect(Object.keys(comment.links[0])).toEqual(expect.arrayContaining([
		"rel",
		"href",
		"action",
		"types"
	]));
}

const testComments = comments => comments.forEach(c => testCommentIntegrity(c));

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

			res = await request.get(`/api/${version}${endpoint}s/${idParam}`);
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

		const res = await request.get(`/api/${version}comments/${idParam}`);

		expect(res.body.comments.length).toBe(1);
		testComments(res.body.comments);
		expect(res.body.comments[0]._id).toBe(parseFloat(idParam));

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
