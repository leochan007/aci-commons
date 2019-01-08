const Mongoose = require('mongoose').Mongoose;

const ACIConfig = require('../config/config');

class MongoDb {

  constructor(db_name) {
    this.db = new Mongoose();
    if (db_name !== '') {
      this.db_name = db_name;
    } else {
      if (ACIConfig.mongodb_url.endsWith('/') && db_name == '') {
        this.db_name = 'default';
      } else {
        this.db_name = '';
      }
    }
    let url = ACIConfig.mongodb_url + (this.db_name == '' ? '' : '/' + this.db_name) + ACIConfig.mongodb_opt_str;
    this.db.connect(url, ACIConfig.mongo_opt);

    console.log('try to connect to ' + this.db_name + ' !');

    //this.db.connection.on('error', console.error.bind(console, this.db_name + ' error:'));

  }

  close() {
    if (this.db !== null) {
      this.db.connection.close();
    }
  }

}

module.exports = {
  MongoDb,
}
