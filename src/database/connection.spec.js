const {connection, mongoose} = require("./connection");

test("Verifies mongo connection", () => {
	return connection.then(data => {
		expect(data.connections[0].name).toBe("adventureArchive");
	},err => {
		//expect(true).toBe(true);
		throw new Error(`Failed to connect to mongoDB: ${err}`);
	});
});

afterAll(done => {
	mongoose.connection.close();
	done();
});
