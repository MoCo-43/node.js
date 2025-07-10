const mysql = require("mysql2");
const sql = require("./product.js"); // {custList }

const pool = mysql.createPool({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: process.env.LIMIT,
});

// console.log(["productList"].query);

async function query(alias, values, where = "") {
  return new Promise((resolve, reject) => {
    console.log(sql[alias].query + where);
    pool.query(sql[alias].query + where, values, (err, result) => {
      if (err) {
        console.log("처리중에러", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = { query };
