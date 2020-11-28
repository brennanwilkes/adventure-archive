const {CONFIG, print, server} = require("./server");
const supertest = require('supertest');
const request = supertest(server.app);

CONFIG.verbose = false;
server.init();
server.start();

test("Config file integrity", () => {
	const configKeys = Object.keys(CONFIG)
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

			res = await request.get(`/api/${version}${endpoint}s/1`);
			expect(res.status >= 200 && res.status <= 299).toBe(true);

			res = await request.post(`/api/${version}${endpoint}s`);
			expect(res.status >= 200 && res.status <= 299).toBe(true);

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
	done();
});
