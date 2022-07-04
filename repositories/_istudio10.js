let tableName = "istudio.test";
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
    // get : async function() {
    //     return await defaultModel.get()
    // },
    // find : async function(id) {
    //     return await defaultModel.find(id)
	// },
	// findQuery : async function(query) {
    //     return await defaultModel.findQuery(query)
	// },
	// update : async function(id,data) {
    //     return await defaultModel.update(id,data)
    // },
	// put : async function(data) {
    //     return await defaultModel.put(data)
    // },
    // remove : async function(id) {
    //     return await defaultModel.remove(id)
    // },

    // ADD CUSTOM FUNCTION BELOW ========================
    // ==================================================

    getSQLTables : async function(){
        return new Promise(function(resolve, reject) {
            var sql = `SELECT table_name FROM information_schema.tables
                        WHERE table_schema = '${process.env.DBNAME}';`
            con.query(sql, function (err, result) {
                if (err) reject(err);

                resolve(result)
            });
        });
    },

	getSQL : async function(tableName){
        return new Promise(function(resolve, reject) {
            var sql = `SELECT 
                            *
                        FROM ${tableName}`
            con.query(sql, function (err, result) {
                if (err) reject(err);

                resolve(result)
            });
        });
    },



    
}