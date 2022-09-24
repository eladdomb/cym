const router = global.router;
const Redis = require("../../utils/redis");
const WordGet = require("../../utils/word-get");

router.get("/words", async (req, res) => {
	const words = await Redis.getWordCounts();
	res.send(words);
});

router.post("/words", async (req, res) => {

	function getDateXDaysAgo(numOfDays, date = new Date()) {
		const daysAgo = new Date(date.getTime());

		daysAgo.setDate(date.getDate() - numOfDays);

		return daysAgo.toISOString().split('T')[0];
	}

	// run on last 7 days
	const promises = [];
	for (let i = 1; i < 8; i++) {
		promises.push(await WordGet.run(getDateXDaysAgo(i), getDateXDaysAgo(i - 1)));
	}

	Promise.all(promises).then((wordsLists) => {
		var finalWords = [];
		wordsLists.forEach(function (wordList) {
			finalWords = finalWords.concat(wordList);
		});
		var wordsDB = {};
		for (const word of finalWords) {
			if (!wordsDB[word]) {
				wordsDB[word] = 1;
			} else {
				wordsDB[word] += 1;
			}
		}
		console.log(wordsDB);
		Redis.addWords(wordsDB);
		res.sendStatus(200);
	});
});

module.exports = router;