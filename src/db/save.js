var sqlite3 = require('sqlite3').verbose();


function insert(params, fn, res) {
  let db = new sqlite3.Database('src/db/t.db');
  db.run(`INSERT INTO jobs(mrid, projectid, jobid) VALUES(?, ?, ?)`, [params.mrid, params.projectid, params.jobid], function(err) {
    if (err) {
      return console.log(err.message);
    }

    console.log('params' + JSON.stringify(params));
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    fn({...params, id: this.lastID }, res);

  });
  db.close();

}

module.exports= {insert}