const mysql = require("mysql");
require("dotenv").config();
const con = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME,
});
con.getConnection((err) => {
  if (err) {
    console.log("Error connecting with db " + err);
  } else {
    console.log("Database connected");
  }
});
module.exports = con;
