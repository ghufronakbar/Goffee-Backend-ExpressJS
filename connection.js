const mysql = require("mysql");

//koneksi database
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "goffee",
});

conn.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected");
});

module.exports = conn;
