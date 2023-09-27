const Sequelize = require('sequelize');

const database = new Sequelize({
    dialect: 'sqlite',
    storage: 'src/db/t.db'
})

module.exports = database;

// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('src/db/t.db', (err) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     console.log('Connected to the in-memory SQlite database.');
//   });
//
// db.run('CREATE TABLE IF NOT EXISTS jobs (mrid TEXT, projectid TEXT, jobid text, status TEXT, token TEXT, )');
//
//
// db.close();
//

