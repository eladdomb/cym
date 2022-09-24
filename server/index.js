// const cors = require("cors");
const express = require("express");
const router = (global.router = express.Router());
const app = express();

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(router);

const listenPort = 3000;

app.listen(listenPort, "localhost", () =>
	console.log("server listening on port " + listenPort)
);

app.use("/words", require("./routes/words"));
app.use("/", require("./routes/client"));