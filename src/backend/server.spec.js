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
], 6));

const testUsers = users => users.forEach(user => testDocumentIntegrity(user, [
	"_id",
	"name",
	"links"
], 3));

const testThreads = threads => threads.forEach(thread => testDocumentIntegrity(thread, [
	"_id",
	"subforum",
	"country",
	"title",
	"links"
], 4));

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

		test(`${endpoint} endpoint responds with api ${version?version:"default"}`, async done => {
			let res = await request.get(`/api/${version}${endpoint}s`);
			expect(res.status >= 200 && res.status <= 299).toBe(true);

			res = await request.get(`/api/${version}${endpoint}s/${idParams[endpoint]}`);
			expect(res.status >= 200 && res.status <= 299).toBe(true);

			res = await request.post(`/api/${version}${endpoint}s`);
			expect(res.status).not.toBe(404);

			done();
		});

		test(`Get ${endpoint}s resource collection with api ${version?version:"default"}`, async done => {
			const res = await request.get(`/api/${version}${endpoint}s`);

			expect(res.body[`${endpoint}s`].length).toBeGreaterThanOrEqual(1);
			testDocuments[`${endpoint}s`](res.body[`${endpoint}s`],endpoint);

			done();
		});

		test(`Get specific ${endpoint} resource with api ${version?version:"default"}`, async done => {

			const res = await request.get(`/api/${version}${endpoint}s/${idParams[endpoint]}`);

			expect(res.body[`${endpoint}s`].length).toBe(1);
			testDocuments[`${endpoint}s`](res.body[`${endpoint}s`]);
			expect(res.body[`${endpoint}s`][0]._id).toBe(parseFloat(idParams[endpoint]));

			done();
		});

		test(`Get specific ${endpoint} resource which does not eixst with api ${version?version:"default"}`, async done => {

			let res = await request.get(`/api/${version}${endpoint}s/garbage`);
			expect(res.status).toBe(404);
			res = await request.get(`/api/${version}${endpoint}s/1`);
			expect(res.status).toBe(404);

			done();
		});

		test(`Get ${endpoint}s with limit param with api ${version?version:"default"}`, async done => {
			const res = await request.get(`/api/${version}${endpoint}s?limit=35`);

			expect(res.body[`${endpoint}s`].length).toBeLessThanOrEqual(35);
			testDocuments[`${endpoint}s`](res.body[`${endpoint}s`],endpoint);

			done();
		});

		test(`Get ${endpoint}s with garbage param with api ${version?version:"default"}`, async done => {
			const res = await request.get(`/api/${version}${endpoint}s?limit=asdfasdf`);

			expect(res.status).toBe(422);

			done();
		});
	});

	test(`Get comments with specific forum with api ${version?version:"default"}`, async done => {
		let res = await request.get(`/api/${version}comments?thread=${idParams.thread.replace("+","%2B")}`);
		expect(res.status).toBe(200);
		expect(res.body.comments.length).toBeGreaterThanOrEqual(4);

		res = await request.get(`/api/${version}comments?thread=asdf`);
		expect(res.status).toBe(422);


		done();
	});

	test(`Get comments with specific user with api ${version?version:"default"}`, async done => {
		let res = await request.get(`/api/${version}comments?user=${idParams.user.replace("+","%2B")}`);
		expect(res.status).toBe(200);
		expect(res.body.comments.length).toBe(1);

		res = await request.get(`/api/${version}comments?user=asdf`);
		expect(res.status).toBe(422);


		done();
	});

	test(`Search queries with api ${version?version:"default"}`, async done => {
		let res = await request.get(`/api/${version}comments?search=Cabinda&search=1900`);

		expect(res.status).toBe(200);
		expect(res.body.comments.length).toBe(1);
		expect(res.body.comments[0]._id).toBe(7.882632764374103e+47);

		res = await request.get(`/api/${version}comments?search=Cabinda`);
		expect(res.status).toBe(200);


		done();
	});

	test(`Search users by name with api ${version?version:"default"}`, async done => {
		let res = await request.get(`/api/${version}users?name=bap9`);

		expect(res.status).toBe(200);
		expect(res.body.users.length).toBe(1);
		expect(res.body.users[0]._id).toBe(1.3116457200976267e+48);

		res = await request.get(`/api/${version}users?name=bap9&name=mrmoto`);
		expect(res.status).toBe(200);
		expect(res.body.users.length).toBe(2);


		done();
	});

	test(`Search threads by title with api ${version?version:"default"}`, async done => {
		let res = await request.get(`/api/${version}threads?title=Skiing%20school%20-%20winter`);

		expect(res.status).toBe(200);
		expect(res.body.threads.length).toBe(1);
		expect(res.body.threads[0]._id).toBe(4.974947305360038e+47);

		res = await request.get(`/api/${version}threads?title=can%20I%20travel%20back%20while%20my%20extension%20is%20in%20progress&title=Skiing%20school%20-%20winter`);
		expect(res.status).toBe(200);
		expect(res.body.threads.length).toBe(2);

		done();
	});

	test(`Search threads by country with api ${version?version:"default"}`, async done => {
		let res = await request.get(`/api/${version}threads?country=Morocco`);
		expect(res.status).toBe(200);

		res = await request.get(`/api/${version}threads?country=Morocco&country=Angola`);
		expect(res.status).toBe(200);

		done();
	});

	test(`Search threads by subforum with api ${version?version:"default"}`, async done => {
		let res = await request.get(`/api/${version}threads?subforum=africa`);
		expect(res.status).toBe(200);

		res = await request.get(`/api/${version}threads?subforum=africa&subforum=America`);
		expect(res.status).toBe(200);

		done();
	});

	test(`Search comments with aggregation pipeline, limiting comments per thread to 1 with api ${version?version:"default"}`, async done => {
		let res = await request.get(`/api/${version}comments?search=angola%20consulate&search=Matadi&groupByThread=true`);

		expect(res.status).toBe(200);
		expect(res.body.comments.length).toBe(1);
		expect(res.body.comments[0].threadId).toBe(4.9925364431161935e+47);

		res = await request.get(`/api/${version}comments?search=angola%20consulate&search=Matadi`);
		expect(res.status).toBe(200);
		expect(res.body.comments.length).toBe(2);
		expect(res.body.comments[0].threadId).toBe(4.9925364431161935e+47);

		res = await request.get(`/api/${version}comments?groupByThread=garbage`);
		expect(res.status).toBe(422);

		done();
	});

	test(`Search comments with country and subforum pipeline with api ${version?version:"default"}`, async done => {
		let res = await request.get(`/api/${version}comments?country=canada`);
		expect(res.status).toBe(200);

		res = await request.get(`/api/${version}comments?subforum=africa&country=angola`);
		expect(res.status).toBe(200);

		res = await request.get(`/api/${version}comments?country=canada&country=angola`);
		expect(res.status).toBe(200);

		res = await request.get(`/api/${version}comments?subforum=africa`);
		expect(res.status).toBe(200);

		done();
	});

	test(`Post new user with api ${version?version:"default"}`, async done => {

		let res = await request.post(`/api/${version}users`).send({name: 'TEST NAME TEST TEST TEST'});
		expect(res.status===201 || res.status===200).toBeTruthy();

		res = await request.post(`/api/${version}users`).send({name: 'bap9'});
		expect(res.status).toBe(200);
		expect(res.body.users.length).toBe(1);
		expect(res.body.users[0].name).toBe("bap9");

		res = await request.post(`/api/${version}users`);
		expect(res.status).toBe(422)

		res = await request.post(`/api/${version}users`).send({name:""});
		expect(res.status).toBe(422)

		done();
	});

	test(`Post new comment with api ${version?version:"default"}`, async done => {

		let res = await request.post(`/api/${version}comments`);
		expect(res.status).toBe(422);

		res = await request.post(`/api/${version}comments`).send({
			user: "DOESNOTEXIST",
			comment:"Comment",
			threadId: idParams.thread
		});
		expect(res.status).toBe(422);

		res = await request.post(`/api/${version}comments`).send({
			user: "TEST NAME TEST TEST TEST",
			comment:"Comment",
			threadId: `${idParams.thread}0`
		});
		expect(res.status).toBe(422);

		res = await request.post(`/api/${version}comments`).send({
			user: "TEST NAME TEST TEST TEST",
			comment:"This is a test comment",
			threadId: idParams.thread
		});

		expect(res.status===201 || res.status===200).toBeTruthy();

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
