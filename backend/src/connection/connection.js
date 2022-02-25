const mysql = require('mysql2');
const { Sequelize } = require('sequelize');

const config = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  dialect: 'mysql',
};

const db = mysql.createConnection(config);

db.connect(err => {
  if (err) throw err;
  db.query("CREATE DATABASE IF NOT EXISTS reviewRestaurants", function (err, result) {
    if (err) throw err;
    console.log("Database created successful");
  });
})

const sequelize = new Sequelize('reviewRestaurants','root','123456',{
  host: 'localhost',
  dialect: 'mysql' || 'mariadb' || 'postgres' || 'mssql',
});

module.exports = {sequelize, db, Sequelize};