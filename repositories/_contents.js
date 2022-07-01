let tableName = "whois.domains.23";
let _table = tableName;
var Model = require('./_model')
var defaultModel = new Model(_table)

// MYSQL
var mysql = require('mysql');

var con = mysql.createConnection({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME,
});

module.exports = {

    // BASE FUNCTIONS LOCATED IN defaultModel
    get : async function() {
        return await defaultModel.get()
    },
    find : async function(id) {
        return await defaultModel.find(id)
	},
	findQuery : async function(query) {
        return await defaultModel.findQuery(query)
	},
	update : async function(id,data) {
        return await defaultModel.update(id,data)
    },
	put : async function(data) {
        return await defaultModel.put(data)
    },
    remove : async function(id) {
        return await defaultModel.remove(id)
    },

    // ADD CUSTOM FUNCTION BELOW ========================
    // ==================================================

	getSQL : async function(page,limit){
        return new Promise(function(resolve, reject) {
            var sql = `SELECT 
                            *
                        FROM domain_names_whoisdatacollector`
            sql += " LIMIT 2"
            con.query(sql, function (err, result) {
                if (err) reject(err);

                resolve(result)
            });
        });
    },

    getWhoIsRecord : async function(page,limit){
        return new Promise(function(resolve, reject) {
            var sql = `SELECT 
                            *
                        FROM whois_record`
            sql += " LIMIT " + limit
			sql += " OFFSET " + (page -1) * limit
            con.query(sql, function (err, result) {
                if (err) reject(err);

                resolve(result)
            });
        });
    },

    
}