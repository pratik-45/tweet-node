const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const auth = require("./utils/auth.js");
const tokenManagement = require("./utils/tokenManagement.js");
const tweets = require("./utils/tweet.js");
const userModule = require("./utils/user.js");
const user = require("./utils/user.js");
const path = require("path");
const fileUpload = require("express-fileupload");

app.use(fileUpload());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.static(__dirname, "public")));
app.use(express.static(__dirname));
app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type,Authorization"
	);
	res.setHeader("Access-Control-Allow-Credentials", true);
	next();
});

app.post("/login", async (req, res) => {
	const loginRes = await auth.login(req.body).catch((err) => {
		console.log(err);
		res.sendStatus(400);
	});
	if (loginRes.name) {
		let token = await tokenManagement
			.createToken(loginRes.id, req.connection.remoteAddress)
			.catch((err) => {
				res.sendStatus(403);
			});
		res.send({...loginRes,token});
	}
});
app.post("/createAccount", async (req, res) => {
	console.log(req.body);
	const registration = await auth.createAccount(req.body).catch((err) => {
		res.sendStatus(400);
	});
	if (registration) {
		let token = await tokenManagement
			.createToken(registration.id, req.connection.remoteAddress)
			.catch((err) => {
				res.sendStatus(403);
			});
		res.send({...registration ,token});
	}
});

app.post("/uploadImage", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	const result = await auth.uploadImage(req.files, userId).catch((err) => {
		res.sendStatus(400);
	});
	if (result) {
		res.send("image successfully uploaded");
	}
});

app.delete("/revokeToken", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	let deleted = await tokenManagement.revokeToken(req).catch((err) => {
		res.status(401).send(err);
	});
	res.send(deleted);
});

app.delete("/revokeTokens", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	let deleted = await tokenManagement.revokeTokens(userId).catch((err) => {
		res.status(401).send(err);
	});
	res.send(deleted);
});

app.get("/profile", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	let user = await userModule.getUser(userId, userId).catch((err) => {
		res.status(401).send(err);
	});
	if (user) {
		res.send(user);
	}
});

app.get("/profile/:userId", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	let user = await userModule
		.getUser(userId, req.params.userId)
		.catch((err) => {
			res.status(401).send(err);
		});
	if (user) {
		res.send(user);
	}
});

app.get("/tweet/:id", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	let tweet = await tweets.get(req.params.id).catch((err) => {
		res.status(401).send(err);
	});
	if (tweet) {
		tweet.like = await tweets.doUserLikes(userId, tweet.id);
		res.send(tweet);
	}
});

app.put("/tweet/like/:id", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	let result = await tweets.likeTweet(userId, req.params.id).catch((err) => {
		res.status(401).send(err);
	});
	res.send(result);
});

app.put("/tweet/unlike/:id", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	let result = await tweets.unlikeTweet(userId, req.params.id).catch((err) => {
		res.status(401).send(err);
	});
	res.send(result);
});

app.put("/user/follow/:id", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	console.log(userId);
	let result = await user.follow(userId, req.params.id).catch((err) => {
		res.status(401).send(err);
	});
	res.send(result);
});

app.put("/user/unfollow/:id", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	let result = await user.unfollow(userId, req.params.id).catch((err) => {
		res.status(401).send(err);
	});
	res.send(result);
});

app.put("/user/block/:id", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	console.log(userId);
	let result = await user.block(userId, req.params.id).catch((err) => {
		res.status(401).send(err);
	});
	res.send(result);
});

app.put("/user/unblock/:id", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	let result = await user.unblock(userId, req.params.id).catch((err) => {
		res.status(401).send(err);
	});
	res.send(result);
});

app.get("/tweets/:userId", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	let userTweets = await tweets
		.getUserTweets(req.params.userId)
		.catch((err) => {
			res.status(401).send(err);
		});
	if (userTweets) {
		for (let index = 0; index < userTweets.length; index++) {
			userTweets[index].like = await tweets.doUserLikes(
				userId,
				userTweets[index].id
			);
		}
		res.send(userTweets);
	}
});

app.get("/tweets", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	let userTweets = await tweets.getUserTweets(userId, userId).catch((err) => {
		res.status(401).send(err);
	});
	if (userTweets) {
		for (let index = 0; index < userTweets.length; index++) {
			userTweets[index].like = await tweets.doUserLikes(
				userId,
				userTweets[index].id
			);
		}
		res.send(userTweets);
	}
});

app.post("/createTweet", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	if (userId) {
		req.body.author_id = userId;
		let tweetRes = await tweets.create(req.body).catch((err) => {
			res.status(401).send(err);
		});
		if (tweetRes) {
			res.send("Tweet created");
		}
	}
});

app.delete("/deleteTweet/:tweetId", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	if (userId) {
		req.body.author_id = userId;
		req.body.id = req.params.tweetId;
		let tweetRes = await tweets.delete(req.body).catch((err) => {
			res.status(401).send(err);
		});
		if (tweetRes) {
			res.send(tweetRes);
		}
	}
});

app.get("/tweets/:tweetId/likes", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	let likes = await tweets.getLikes(userId, req.params.tweetId).catch((err) => {
		res.status(502).send(err);
	});
	if (likes) {
		res.send(likes);
	}
});

app.get("/getChildTweets/:tweetId", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	let childTweets = await tweets
		.getChildTweets(req.params.tweetId, userId)
		.catch((err) => {
			res.status(401).send(err);
		});
	for (let index = 0; index < childTweets.length; index++) {
		childTweets[index].like = await tweets.doUserLikes(
			userId,
			childTweets[index].id
		);
	}
	res.send(childTweets);
});

app.get("/getTimeLine", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	let tweetsList = await tweets.getTimeLineTweets(userId).catch((err) => {
		res.status(401).send(err);
	});
	for (let index = 0; index < tweetsList.length; index++) {
		tweetsList[index].like = await tweets.doUserLikes(
			userId,
			tweetsList[index].id
		);
	}
	res.send(tweetsList);
});

app.get("/getFeed", async (req, res) => {
	let userId = await auth.isLoggedIn(req).catch((err) => {
		res.status(401).send(err);
	});
	let tweetsList = await tweets.getAllTweets().catch((err) => {
		res.status(401).send(err);
	});
	for (let index = 0; index < tweetsList.length; index++) {
		tweetsList[index].like = await tweets.doUserLikes(
			userId,
			tweetsList[index].id
		);
	}
	res.send(tweetsList);
});

app.listen(process.env.PORT, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`Running server on localhost:${process.env.PORT}`);
	}
});
