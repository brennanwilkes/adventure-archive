const readline = require("readline");


console.log("connecting to mongo")
const {connection, mongoose} = require("../database/connection");
const Comment = require("../database/models/comment");
const Thread = require("../database/models/thread");
const User = require("../database/models/user");


const stdInterface = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

const upsertData = (Model,filter,data) => {
	Model.updateOne(
		filter,
		data,
		{upsert:true},
		(err,docs) => {
			if(err){
				console.error(err);
			}
		});
}

connection.once("open", () => {
	console.log("Reading STDIN");
	stdInterface.prompt();
	stdInterface.on("line", data => {
		data = data.split("<>DELIM<>");

		if(data[4] === undefined){
			console.error("Failed to upload forum. Data Recieved:");
			console.error(data[0].substring(0,100));
			return;
		}

		upsertData(
			Comment,
			{_id: parseInt(data[4],16)},
			{
				threadId: parseInt(data[3],16),
				userId: parseInt(data[5],16),
				date: data[7],
				position: data[8],
				content: data[9]
			});

		upsertData(
			User,
			{_id: parseInt(data[5],16)},
			{name: data[6]});

		upsertData(
			Thread,
			{_id: parseInt(data[3],16)},
			{
				subforum: data[0],
				country: data[1],
				title: data[2]
			});

			//Mongoose has memory leaks :(
		delete mongoose.models['User'];
		delete mongoose.models['Thread'];
		delete mongoose.models['Comment'];
		delete connection.collections['users'];
		delete connection.collections['threads'];
		delete connection.collections['comments'];
		delete mongoose.modelSchemas['User'];
		delete mongoose.modelSchemas['Thread'];
		delete mongoose.modelSchemas['Comment'];

	});
});


/*
				0			1				2			3			4			5			6		7		8				9
delimOutput "$forumName" "$countryName" "$pageTitle" "$threadID" "$commentId" "$userId" "$user" "$time" "$position" "$contentStripped"
[
  'Africa',
  'Morocco',
  'Surfing Agadir to Essaouira',
  '52551fc0a89fd8b6ee74a3af1910bf347fdd8bcc',
  '4cda3322371537851d71fd35a289940b44029c9c',
  '101e44c2069082a8229aadcb2c5133e34fbd135b',
  'karlgrayreis461917',
  '10:31 UTC 09 Mar 2020',
  '0',
  'I&#39;m a decent surfer planning on solo-backpacking from Agadir up to Essaouira for about a week and a half, thought I&#39;m not exactly sure yet how I&#39;ll distribute my time in different places. From what I&#39;ve been able to find, good places for surfing and just traveling in general in that area are Agadir, Taghazout, Imsouane, Sidi Kaouki, and Essaouira itself. I&#39;m looking for advice on how to split up my time, ease of using public transportation around the area, ways to spend my time outside of surfing, and/or any other tips that people might have! Thanks in advance, very excited to hear what people have to say about traveling in this area.'
]

*/
