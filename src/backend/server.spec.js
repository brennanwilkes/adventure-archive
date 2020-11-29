const {CONFIG, print, server} = require("./server");
const {mongoose} = require("../database/connection");

const supertest = require('supertest');
const request = supertest(server.app);

CONFIG.verbose = false;
server.init();
server.start();

const idParams = {
	comment: "6.214545011292772e+47",
	user: "8.290203131731329e+47",
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

const testComments = comments => comments.forEach(comment => testDocumentIntegrity(comment, [
	"_id",
	"content",
	"date",
	"position",
	"threadId",
	"userId",
	"links"
], 5));

const testUsers = users => users.forEach(user => testDocumentIntegrity(user, [
	"_id",
	"name",
	"links"
], 2));

const testThreads = threads => threads.forEach(thread => testDocumentIntegrity(thread, [
	"_id",
	"subforum",
	"country",
	"title",
	"links"
], 2));

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

		test(`Get ${endpoint}s with limit param`, async done => {
			const res = await request.get(`/api/${version}${endpoint}s?limit=35`);

			expect(res.body[`${endpoint}s`].length).toBeLessThanOrEqual(35);
			testDocuments[`${endpoint}s`](res.body[`${endpoint}s`],endpoint);

			done();
		});

		test(`Get ${endpoint}s with garbage param`, async done => {
			const res = await request.get(`/api/${version}${endpoint}s?limit=asdfasdf`);

			expect(res.status).toBe(422);

			done();
		});
	});

	test(`Get comments with specific forum`, async done => {
		let res = await request.get(`/api/${version}comments?thread=${idParams.thread.replace("+","%2B")}`);
		expect(res.status).toBe(200);
		expect(res.body.comments.length).toBe(3);

		res = await request.get(`/api/${version}comments?thread=asdf`);
		expect(res.status).toBe(422);


		done();
	});

	test(`Get comments with specific user`, async done => {
		let res = await request.get(`/api/${version}comments?user=${idParams.user.replace("+","%2B")}`);
		expect(res.status).toBe(200);
		expect(res.body.comments.length).toBe(1);

		res = await request.get(`/api/${version}comments?user=asdf`);
		expect(res.status).toBe(422);


		done();
	});

	test(`Search queries`, async done => {
		let res = await request.get(`/api/${version}comments?search=Cabinda&search=1900`);

		expect(res.status).toBe(200);
		expect(res.body.comments.length).toBe(1);
		expect(res.body.comments[0]._id).toBe(7.882632764374103e+47);

		res = await request.get(`/api/${version}comments?search=Cabinda`);
		expect(res.status).toBe(200);


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
