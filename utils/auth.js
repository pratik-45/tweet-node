const con = require("./db.js");
const tokenManagement = require("./tokenManagement.js");
const user = require("./user.js");
const auth = {
	login: async (user) => {
		return new Promise((resolve, reject) => {
			let sql = `select * from users where (email='${user.email}' and password=md5('${user.password}')) or (username='${user.email}' and password=md5('${user.password}'))`;
			console.log(sql);
			con.query(sql, (err, result) => {
				if (err) {
					console.log(err)
					reject(2);
				} else {
					if (result.length == 0) {
						reject(0);
					} else {
						console.log("loggedIn");
						resolve(result[0]);
					}
				}
			});
		});
	},
	createAccount: async (user) => {
		return new Promise((resolve, reject) => {
			let sql = `insert into users (name,username,email,password,dob,gender,profile_pic,cover_pic) values ( '${user.name}','${user.username}','${user.email}',md5('${user.pass}'),null,'${user.gender}' ,'','')`;
			con.query(sql, (err, result) => {
				if (err) {
					reject(2);
				} else {
					console.log(result);
					resolve({id:result.insertId,...user});
				}
			});
		});
	},
	uploadImage: async (file, userId) => {
		return new Promise((resolve, reject) => {
			if (!file) {
				reject("NO files were uploaded");
			}
			var fileArr = file.file;
			var imgName = fileArr.name;
			if (
				fileArr.mimetype == "image/jpg" ||
				fileArr.mimetype == "image/jpeg" ||
				fileArr.mimetype == "image/png" ||
				fileArr.mimetype == "image/gif"
			) {
				fileArr.mv("public/images/upload_image/" + imgName, function (err) {
					if (err) {
						reject(err);
					}
					let sql = `UPDATE users set profile_pic='${imgName}' where id='${userId}'`;
					con.query(sql, (err, result) => {
						if (err) {
							reject(err);
						}
						if (result.affectedRows) {
							resolve("successfully uploaded");
						}
					});
				});
			} else {
				reject(
					"couldn't upload file of " + files.mimetype + " Please try again."
				);
			}
		});
	},

	isLoggedIn: async (req) => {
		return new Promise(async (resolve, reject) => {
			let token = req.headers["authorization"];
			if (!token) {
				reject("User is not authorised!");
			}
			if (token.trim() != "") {
				token = token.split(" ")[1];
				let userId = await tokenManagement.verifyToken(token).catch((err) => {
					reject("User is not authorised!");
				});
				if (userId) {
					resolve(userId);
				}
			} else {
				reject(false);
			}
		});
	},
};
module.exports = auth;
