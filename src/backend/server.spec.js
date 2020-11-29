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

testDocumentIntegrity = (doc, requires, linkLength = 1) => {
	expect(Object.keys(doc)).toEqual(expect.arrayContaining(requires));
	expect(Object.keys(doc.links[0])).toEqual(expect.arrayContaining([
		"rel",
		"href",
		"action",
		"types"
	]));
	expect(doc.links.length).toBe(linkLength);
}

const testCommentIntegrity = comment => testDocumentIntegrity(comment, [
	"_id",
	"content",
	"date",
	"position",
	"threadId",
	"userId",
	"links"
], 3);

const testUserIntegrity = user => testDocumentIntegrity(user, [
	"_id",
	"name",
	"links"
]);

const testThreadIntegrity = thread => testDocumentIntegrity(thread, [
	"_id",
	"subforum",
	"country",
	"title",
	"links"
]);

const testComments = comments => comments.forEach(c => testCommentIntegrity(c));
const testUsers = users => users.forEach(u => testUserIntegrity(u));
const testThreads = threads => threads.forEach(t => testThreadIntegrity(t));

testDocuments = {
	comments : testComments,
	users : testUsers,
	threads : testThreads
}


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

		test(`Get ${endpoint}s resource collection`, async done => {
			const res = await request.get(`/api/${version}${endpoint}s`);

			expect(res.body[`${endpoint}s`].length).toBeGreaterThanOrEqual(1);
			testDocuments[`${endpoint}s`](res.body[`${endpoint}s`],endpoint);

			done();
		});

		test(`Get specific ${endpoint} resource`, async done => {

			const res = await request.get(`/api/${version}${endpoint}s/${idParams[endpoint]}`);

			expect(res.body[`${endpoint}s`].length).toBe(1);
			testDocuments[`${endpoint}s`](res.body[`${endpoint}s`]);
			expect(res.body[`${endpoint}s`][0]._id).toBe(parseFloat(idParams[endpoint]));

			done();
		});

		test(`Get specific ${endpoint} resource which does not eixst`, async done => {

			let res = await request.get(`/api/${version}${endpoint}s/garbage`);
			expect(res.status).toBe(404);
			res = await request.get(`/api/${version}${endpoint}s/1`);
			expect(res.status).toBe(404);

			done();
		});
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
