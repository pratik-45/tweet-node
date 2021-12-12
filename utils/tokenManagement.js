const con = require("./db.js");
const tokenManagement = {
  generateToken: () => {
    let alphanum = "abcdefghijklmnopqrstuvwxyz1234567890";
    let token = "";
    while (token.length < 32) {
      let index = Math.floor(Math.random() * alphanum.length);
      token += alphanum[index];
    }
    return token;
  },
  verifyToken: async (token) => {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM user_tokens WHERE token=md5('${token}')`;
      con.query(query, async (err, result) => {
        if (err) {
          console.log(err);
          reject("ERROR1");
        }
        if (result.length == 0) {
          reject("ERROR2");
          if (err) {
            reject("ERROR3");
          }
        } else {
          resolve(result[0].user_id);
        }
      });
    });
  },
  createToken: async (userId, ip) => {
    return new Promise((resolve, reject) => {
      let token = tokenManagement.generateToken();
      let query = `SELECT token FROM user_tokens WHERE token=md5('${token}')`;
      con.query(query, async (err, result) => {
        if (err) {
          reject("ERROR");
        }
        if (result.length == 0) {
          let expiry =
            "TIMESTAMPADD(HOUR, 7, TIMESTAMPADD(DAY, 10, CURDATE()))";
          query = `insert into user_tokens (user_id,token,expiry,ip) values ('${userId}',md5('${token}'),${expiry},'${ip}')`;
          console.log(query);
          con.query(query, async (err, result) => {
            if (err) {
              console.log(err);
              reject("ERROR");
            }
            if (result) {
              resolve(token);
            }
          });
        } else {
          let cT = await tokenManagement.createToken(userId, ip);
          resolve(cT);
        }
      });
    });
  },
  revokeTokens: async (userId) => {
    return new Promise((resolve, reject) => {
      let query = `DELETE  FROM user_tokens WHERE user_id='${userId}'`;
      con.query(query, (err, result) => {
        if (err) {
          console.log(err);
          reject("Error while revoking tokens");
        }
        if (result) {
          resolve(`All tokens revoked for userId ${userId}`);
        }
      });
    });
  },
  revokeToken: async (req) => {
    return new Promise((resolve, reject) => {
      let token = req.headers["authorization"];
      if (!token || token.trim() == "") {
        reject("User is not authorised!");
      }
      token = token.split(" ")[1];
      let query = `delete FROM user_tokens WHERE token=md5('${token}')`;
      con.query(query, (err, result) => {
        if (err) {
          console.log(err);
          reject("Error while revoking tokens");
        }
        if (result) {
          resolve(`Tokens revoked successfully`);
        }
      });
    });
  },
};
module.exports = tokenManagement;
