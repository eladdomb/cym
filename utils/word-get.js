const Http = require("http");
const Redis = require("../utils/redis");

const API_KEY = "8e2cc95880834c2c8ad4449ce05feef5";
const API_HOST = "newsapi.org";
const API_PATH =
	"/v2/everything?language=en&pageSize=100&sortBy=publishedAt&sources=bbc-news&apiKey=";

const options = {
	host: API_HOST,
	path: API_PATH + API_KEY,
	headers: {"User-Agent": "Mozilla/5.0"},
};

const WordGet = {};


WordGet.run = async function (from, to) {
	return new Promise(function (resolve, reject) {

		function stripNonWordChars(str) {
			return str.replace(/[^a-z ]/gi, "");
		}

		function listWords(str){
			return str.split(" ");
		}

		const callback = function (response) {
			let str = "";

			response.on("data", function (chunk) {
				str += chunk;
			});

			response.on("end", function () {
				try {
					const data = JSON.parse(str);
					const articles = data.articles;
					let wordsList = [];
					for (let article of articles) {
						const title = stripNonWordChars(article.title);
						wordsList = wordsList.concat(listWords(title));
						const description = stripNonWordChars(article.description);
						wordsList = wordsList.concat(listWords(description));
					}
					resolve(wordsList);
				} catch (e) {
					reject();
				}
			});
		};
		Http.request(options, callback).end();

	});


};

module.exports = WordGet;