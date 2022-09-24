const Client = require("redis").createClient();

Client.on('error', (err) => console.log('Redis Client Error', err));

Client.connect();

const Redis = {};

Redis.addWords = async function (words) {

	// first always flush DB
	await Client.flushAll();
	for (const [word, count] of Object.entries(words)) {
		console.log("adding ",word,count);
		await Client.zAdd("wordCounts", {score: count, value:word.toString()});
	}

};

Redis.getWordCounts = async function () {
	return await Client.zRange("wordCounts", 0 , -1);
};

module.exports = Redis;