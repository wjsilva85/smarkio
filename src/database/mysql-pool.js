"use strict";

const mysql = require("mysql");

const config = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_SCHEMA,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  connectionLimit: 22
};

const pool = mysql
  .createPool(config)
  .on("connection", _ => {
    console.log("Mysql_pool => criado");
  })
  .on("release", _ => {
    console.log("Mysql_pool => conection returned.");
  });

process.on("SIGINT", _ => {
  pool.end(err => {
    if (err) console.log(err);
    console.log("poll => closed");
    process.exit(0);
  });
});

/**
 *
 * @param {string} sql Mysql query string
 * @returns {Promise<any>}
 */
const query = sql => {
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        console.log("Error is from:", sql);
        return reject(err);
      }

      return resolve(result);
    });
  });
};

module.exports.query = query;
