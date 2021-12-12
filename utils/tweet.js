const con = require("./db.js");
const userModule = require("./user.js");
const tweet = {
  create: (tweet) => {
    return new Promise((resolve, reject) => {
      tweet.type = tweet.type | 0;
      tweet.parent_tweet = tweet.parent_tweet | 0;
      tweet.quoted_tweet = tweet.quoted_tweet | 0;
      let sql = `insert into tweets (author_id,text,type,parent_tweet,quoted_tweet) values ('${tweet.author_id}','${tweet.text}','${tweet.type}','${tweet.parent_tweet}','${tweet.quoted_tweet}')`;
      con.query(sql, (err, result) => {
        if (err) {
          reject("Error with query");
        }
        if (result) {
          resolve("Tweet posted successfully");
        }
      });
      resolve(tweet);
    });
  },
  delete: (tweet) => {
    return new Promise((resolve, reject) => {
      let sql = `delete from tweets where id='${tweet.id}' and author_id='${tweet.author_id}'`;
      con.query(sql, (err, result) => {
        if (err) {
          reject("Error with query");
        }
        if (result.affectedRows) {
          resolve("Tweet Deleted successfully");
        } else {
          reject("User is not authorised to perform this operation!");
        }
      });
    });
  },
  get: (tweetId, userId) => {
    return new Promise((resolve, reject) => {
      let sql = `select tweets.* , (select count(*) from tweet_likes where tweet_id=tweets.id) as likes from tweets where id=${tweetId}`;
      con.query(sql, async (err, result) => {
        if (err) {
          reject("Error with query");
        }
        if (result.length != 0) {
          let blockingStatus = await userModule.getBlockStatus(
            userId,
            result[0].author_id
          );
          if (userModule.isBlocked(blockingStatus)) {
            reject("This tweet is currently unavailable");
          }
          resolve(result[0]);
        } else {
          reject("No tweet Exists");
        }
      });
    });
  },
  getChildTweets: (tweetId, userId) => {
    return new Promise(async (resolve, reject) => {
      let blockedIds = await userModule
        .getBlockedAccounts(userId)
        .catch((err) => {
          reject(err);
        });
      let sql =
        `select tweets.* , (select count(*) from tweet_likes where tweet_id=tweets.id) as likes from tweets where tweets.parent_tweet=${tweetId} ` +
        (blockedIds.length
          ? `and tweets.author_id not in (${blockedIds})`
          : "") +
        ` ORDER BY doc ASC`;
      con.query(sql, (err, result) => {
        if (err) {
          console.log(err);
          reject("Error with query");
        }
        resolve(result);
      });
    });
  },
  getUserTweets: (myId, userId) => {
    return new Promise(async (resolve, reject) => {
      let blockingStatus = await userModule.getBlockStatus(myId, userId);
      if (userModule.isBlocked(blockingStatus)) {
        resolve([]);
      }
      let sql = `select tweets.* , (select count(*) from tweet_likes where tweet_id=tweets.id) as likes from tweets where author_id=${userId}`;
      con.query(sql, (err, result) => {
        if (err) {
          reject("Error with query");
        }
        resolve(result);
      });
    });
  },
  getLikes: (myId, tweetId) => {
    return new Promise(async (resolve, reject) => {
      await tweet.get(tweetId, myId).catch((err) => {
        reject(err);
      });
      let sql = `select tweet_likes.user_id,users.name,users.email,users.username from tweet_likes join users on users.id=tweet_likes.user_id where tweet_id='${tweetId}'`;
      con.query(sql, (err, result) => {
        if (err) {
          reject("Error with query");
        }
        resolve(result);
      });
    });
  },
  doUserLikes: (userId, tweetId) => {
    return new Promise(async (resolve, reject) => {
      await tweet.get(tweetId, userId).catch((err) => {
        reject(err);
      });
      let sql = `select count(*) as total from tweet_likes where user_id='${userId}' and tweet_id='${tweetId}'`;
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(Boolean(result[0].total));
      });
    });
  },
  likeTweet: (userId, tweetId) => {
    return new Promise(async (resolve, reject) => {
      await tweet.get(tweetId, userId).catch((err) => {
        reject(err);
      });
      let isLiked = await tweet.doUserLikes(userId, tweetId).catch((err) => {
        reject(err);
      });
      if (isLiked) {
        resolve("Tweet Already Liked");
      }
      let sql = `insert into tweet_likes (user_id,tweet_id) values ('${userId}','${tweetId}')`;
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        if (result.affectedRows) {
          resolve("Tweet Liked successfully");
        } else {
          reject("Something went wrong!");
        }
      });
    });
  },
  unlikeTweet: (userId, tweetId) => {
    return new Promise(async (resolve, reject) => {
      await tweet.get(tweetId, userId).catch((err) => {
        reject(err);
      });
      let isLiked = await tweet.doUserLikes(userId, tweetId).catch((err) => {
        reject(err);
      });
      if (!isLiked) {
        resolve("Tweet Not Liked");
      }
      let sql = `delete from tweet_likes where user_id='${userId}' and tweet_id='${tweetId}'`;
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        if (result.affectedRows) {
          resolve("Tweet UnLiked successfully");
        } else {
          reject("Something went wrong!");
        }
      });
    });
  },
  getTimeLineTweets: (userId) => {
    return new Promise(async (resolve, reject) => {
      let blockedIds = await userModule
        .getBlockedAccounts(userId)
        .catch((err) => {
          reject(err);
        });
      let sql = `select case when user1='${userId}' then user2 else user1 end as id from follows where (user1='${userId}' and follow2=1) or (user2='${userId}' and follow1=1)`;
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        if (result.length) {
          let ids = [userId];
          result.forEach((userId) => {
            ids.push(userId.id);
          });
          if (!blockedIds.length) {
            blockedIds = [0];
          }
          sql = `select * from tweets where author_id in (${ids}) and author_id not in (${blockedIds}) ORDER BY doc ASC`;
          con.query(sql, (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
        } else {
          reject("Please follow to get tweets");
        }
      });
    });
  },
  getAllTweets: () => {
    return new Promise(async (resolve, reject) => {
      let sql = `select tweets.*,users.name,users.email,users.username from tweets left join users on users.id=tweets.author_id ORDER BY doc DESC`;
          con.query(sql, (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
    });
  },
};

module.exports = tweet;
