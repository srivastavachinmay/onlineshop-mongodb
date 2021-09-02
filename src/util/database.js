// const mysql = require('mysql2')
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database : 'online-shop',
//     password : 'cheenu'
// })
// module.exports = pool.promise()
//

const Sequelize = require('sequelize')

const sequelize = new Sequelize('online-shop', 'root', 'cheenu', {dialect: 'mysql', host: 'localhost'})

module.exports = sequelize