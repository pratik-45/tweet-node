const con = require("./db.js");
const user = {
  NoConnection: 0,
  OnlyFisrtFollows: 1,
  OnlySecondFollows: 2,
  BothFollow: 3,
  BlockStatus: {
    NoBlock: 0,
    OnlyFirstBlocks: 1,
    OnlySecondBlocks: 2,
    BothBlock: 3,
  },
  isBlocked(blockingStatus) {
    return (
      blockingStatus == user.BlockStatus.BothBlock ||
      blockingStatus == user.BlockStatus.OnlySecondBlocks
    );
  },
  getUser: async (myId, userId) => {
    return new Promise((resolve, reject) => {
      let sql = `SELECT id,name,email,username,doj,dob,gender,profile_pic,cover_pic FROM users WHERE id=${userId}`;
      con.query(sql, async (err, result) => {
        if (err) {
          reject(err);
        }
        if (result.length) {
          let userAccount = result[0];
          userAccount.followings = await user.getFollowings(myId, userId);
          userAccount.followers = await user.getFollowers(myId, userId);
          userAccount.tweets = await user.getUserTotalTweetsCount(myId, userId);
          userAccount.followStatus = await user.getFollowStatus(myId, userId);
          userAccount.blockingStatus = await user.getBlockStatus(myId, userId);
          if (user.isBlocked(userAccount.blockingStatus)) {
            userAccount.email = "";
            userAccount.doj = "";
            userAccount.dob = "";
            userAccount.profile_pic = "";
            userAccount.cover_pic = "";
            userAccount.followings = [];
            userAccount.followers = [];
            userAccount.tweets = [];
          }
          resolve(userAccount);
        } else {
          reject("user not found");
        }
      });
    });
  },
  getUserTotalTweetsCount: (myId, userId) => {
    return new Promise((resolve, reject) => {
      let sql = `select count(*) as total from tweets where author_id=${userId}`;
      con.query(sql, async (err, result) => {
        if (err) {
          reject("Error with query");
          console.log(err);
        }
        let blockingStatus = await user.getBlockStatus(myId, user.id);
        if (user.isBlocked(blockingStatus)) {
          resolve(0);
        }
        resolve(result[0].total);
      });
    });
  },
  getFollowStatus: (userId1, userId2) => {
    return new Promise((resolve, reject) => {
      let sql = `select * from follows where (user1='${userId1}' and user2='${userId2}') or (user2='${userId1}' and user1='${userId1}')`;
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        if (
          result.length == 0 ||
          (result[0].follow1 == 0 && result[0].follow2 == 0)
        ) {
          resolve(user.NoConnection);
        } else {
          if (result[0].follow1 && result[0].follow2) {
            resolve(user.BothFollow);
          } else {
            if (
              (userId1 == result[0].user1 && result[0].follow1) ||
              (userId1 == result[0].user2 && result[0].follow2)
            ) {
              resolve(user.OnlySecondFollows);
            } else {
              resolve(user.OnlyFisrtFollows);
            }
          }
        }
      });
    });
  },
  getBlockStatus: (userId1, userId2) => {
    return new Promise((resolve, reject) => {
      let sql = `select * from block where (user1='${userId1}' and user2='${userId2}') or (user2='${userId1}' and user1='${userId1}')`;
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        if (
          result.length == 0 ||
          (result[0].block1 == 0 && result[0].block2 == 0)
        ) {
          resolve(user.BlockStatus.NoBlock);
        } else {
          if (result[0].block1 && result[0].block2) {
            resolve(user.BlockStatus.BothBlock);
          } else {
            if (
              (userId1 == result[0].user1 && result[0].block1) ||
              (userId1 == result[0].user2 && result[0].block2)
            ) {
              resolve(user.BlockStatus.OnlySecondBlocks);
            } else {
              resolve(user.BlockStatus.OnlyFirstBlocks);
            }
          }
        }
      });
    });
  },
  getFollowingCount: (myId, userId) => {
    return new Promise(async (resolve, reject) => {
      let blockingStatus = await user.getBlockStatus(myId, userId);
      if (user.isBlocked(blockingStatus)) {
        resolve(0);
      }
      let sql = `select count(*) as total from follows where (user1='${userId}' and follow2=1) or (user2='${userId}' and follow1=1)`;
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result[0].total);
      });
    });
  },
  getBlockedAccounts: (userId) => {
    return new Promise((resolve, reject) => {
      let sql = `select case when user1='${userId}' then user2 else user1 end as user_id from block where (user1='${userId}' and (block1=1 or block2=1)) or (user2='${userId}' and (block2=1 or block1=1))`;
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        let ids = [];
        result.forEach((row) => {
          ids.push(row.user_id);
        });
        resolve(ids);
      });
    });
  },
  getFollowings: (myId, userId) => {
    return new Promise(async (resolve, reject) => {
      let blockingStatus = await user.getBlockStatus(myId, userId);
      if (user.isBlocked(blockingStatus)) {
        resolve([]);
      }
      let sql = `select ids.user_id,users.name,users.email,users.gender,users.profile_pic from (select case when user1='${userId}' then user2 else user1 end as user_id from follows where (user1='${userId}' and follow2=1) or (user2='${userId}' and follow1=1)) as ids join users on users.id=ids.user_id`;
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },
  getFollowersCount: (myId, userId) => {
    return new Promise(async (resolve, reject) => {
      let blockingStatus = await user.getBlockStatus(myId, userId);
      if (user.isBlocked(blockingStatus)) {
        resolve(0);
      }
      let sql = `select count(*) as total from follows where (user1='${userId}' and follow1=1) or (user2='${userId}' and follow2=1)`;
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result[0].total);
      });
    });
  },
  unfollow: (myId, userId) => {
    return new Promise(async (resolve, reject) => {
      if (myId == userId) {
        reject("You can't unfollow yourself");
      }
      await user.getUser(myId, userId).catch((err) => {
        reject(err);
      });
      let userConnection = await user
        .getFollowStatus(myId, userId)
        .catch((err) => {
          reject(err);
        });
      if (
        userConnection == user.NoConnection ||
        userConnection == user.OnlySecondFollows
      ) {
        reject("You are not following this user!");
      }
      let sql = `select * from follows where (user1='${myId}' and user2='${userId}') or (user2='${myId}' and user1='${userId}')`;
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        if (result.length) {
          sql = `update follows set follow1=0 where user2='${myId}' and user1='${userId}'`;
          if (result[0].user1 == myId) {
            sql = `update follows set follow2=0 where user1='${myId}' and user2='${userId}'`;
            if (result[0].user1 == myId && result[0].follow1 == 0) {
              sql = `delete from follows where (user1='${myId}' and user2='${userId}')`;
            }
          }
          con.query(sql, (err, result) => {
            if (err) {
              reject(err);
            }
            if (result.affectedRows) {
              resolve("User UnFollowed successfully!");
            } else {
              reject("Something went wrong!");
            }
          });
        } else {
          reject("You are not following this user!");
        }
      });
    });
  },
  unblock: (myId, userId) => {
    return new Promise(async (resolve, reject) => {
      if (myId == userId) {
        reject("You can't unblock yourself");
      }
      await user.getUser(myId, userId).catch((err) => {
        reject(err);
      });
      let userConnection = await user
        .getBlockStatus(myId, userId)
        .catch((err) => {
          reject(err);
        });
      if (
        userConnection == user.BlockStatus.NoBlock ||
        userConnection == user.BlockStatus.OnlySecondBlocks
      ) {
        reject("You are not blocked this user!");
      }
      let sql = `select * from block where (user1='${myId}' and user2='${userId}') or (user2='${myId}' and user1='${userId}')`;
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        if (result.length) {
          sql = `update block set block1=0 where user2='${myId}' and user1='${userId}'`;
          if (result[0].user1 == myId) {
            sql = `update block set block2=0 where user1='${myId}' and user2='${userId}'`;
            if (result[0].user1 == myId && result[0].follow1 == 0) {
              sql = `delete from block where (user1='${myId}' and user2='${userId}')`;
            }
          }
          con.query(sql, (err, result) => { 
            if (err) {
              reject(err);
            }
            if (result.affectedRows) {
              resolve("User Unblocked successfully!");
            } else {
              reject("Something went wrong!");
            }
          });
        } else {
          reject("You are not blocked this user!");
        }
      });
    });
  },
  follow: (myId, userId) => {
    console.log(myId, userId);
    return new Promise(async (resolve, reject) => {
      if (myId == userId) {
        reject("You can't follow yourself");
      }
      await user.getUser(myId, userId).catch((err) => {
        reject(err);
      });
      let userConnection = await user
        .getFollowStatus(myId, userId)
        .catch((err) => {
          reject(err);
        });
      if (
        userConnection == user.BothFollow ||
        userConnection == user.OnlyFisrtFollows
      ) {
        reject("User Already being followed");
      }
      let sql = `select * from follows where (user1='${myId}' and user2='${userId}') or (user2='${myId}' and user1='${userId}')`;
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        if (result.length) {
          sql = `update follows set follow1=1 where user2='${myId}' and user1='${userId}'`;
          if (result[0].user1 == myId) {
            sql = `update follows set follow2=1 where user1='${myId}' and user2='${userId}'`;
          }
          con.query(sql, (err, result) => {
            if (err) {
              reject(err);
            }
            if (result.affectedRows) {
              resolve("User Follow successfully");
            } else {
              reject("Something went wrong!");
            }
          });
        } else {
          sql = `insert into follows (user1,user2,follow1,follow2) values ('${myId}','${userId}','0','1')`;
          con.query(sql, (err, result) => {
            if (err) {
              reject(err);
            }
            if (result.affectedRows) {
              resolve("User Follow successfully");
            } else {
              reject("Something went wrong!");
            }
          });
        }
      });
    });
  },
  block: (myId, userId) => {
    console.log(myId, userId);
    return new Promise(async (resolve, reject) => {
      if (myId == userId) {
        reject("You can't block yourself");
      }
      await user.getUser(myId, userId).catch((err) => {
        reject(err);
      });
      let userConnection = await user
        .getBlockStatus(myId, userId)
        .catch((err) => {
          reject(err);
        });
      if (
        userConnection == user.BlockStatus.BothBlock ||
        userConnection == user.BlockStatus.OnlyFirstBlocks
      ) {
        reject("User is already");
      }
      let sql = `select * from block where (user1='${myId}' and user2='${userId}') or (user2='${myId}' and user1='${userId}')`;
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        if (result.length) {
          sql = `update block set block1=1 where user2='${myId}' and user1='${userId}'`;
          if (result[0].user1 == myId) {
            sql = `update block set block2=1 where user1='${myId}' and user2='${userId}'`;
          }
          con.query(sql, (err, result) => {
            if (err) {
              reject(err);
            }
            if (result.affectedRows) {
              sql = `delete from follows where (user1='${myId}' and user2='${userId}') or (user2='${myId}' and user1='${userId}' )`;
              con.query(sql, (err, result) => {
                resolve("User Blocked successfully");
              });
            } else {
              reject("Something went wrong!");
            }
          });
        } else {
          sql = `insert into block (user1,user2,block1,block2) values ('${myId}','${userId}','0','1')`;
          con.query(sql, (err, result) => {
            if (err) {
              reject(err);
            }
            if (result.affectedRows) {
              resolve("User Blocked successfully");
            } else {
              reject("Something went wrong!");
            }
          });
        }
      });
    });
  },
  getFollowers: (myId, userId) => {
    return new Promise(async (resolve, reject) => {
      let blockingStatus = await user.getBlockStatus(myId, userId);
      if (user.isBlocked(blockingStatus)) {
        resolve([]);
      }
      let sql = `select ids.user_id,users.name,users.email,users.gender,users.profile_pic from (select case when user1='${userId}' then user2 else user1 end as user_id from follows where (user1='${userId}' and follow1=1) or (user2='${userId}' and follow2=1)) as ids join users on users.id=ids.user_id`;
      con.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },

};

module.exports = user;
