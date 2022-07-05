// CALL ENV FILE
require('dotenv').config()

var express = require('express');
var cron = require('node-cron');
let migrationService = require('./services/migrationService')

var app = express();

// APP  CONTAINER =========== >> 
let conn = require('./config/DbConnect');
conn.connectToServer( function( err, client ) { // MAIN MONGO START
    console.log("connecting to server....");

    
    
    // cron.schedule('*/20 * * * * *', () => {
    //   // THIS IS USED TO MIGRATE DOMAINSTER
    //   migrationService.contents();
    // });

    cron.schedule('0 */2 * * * *', () => {
      // THIS IS USED TO MIGRATE ISTUDIO DB RAW DATA
      // GET ALL FROM DB TABLE AND IMPORT ALL
      // migrationService.istudio10();
    });
    migrationService.istudio10();


    if (err) console.log(err);
    // start the rest of your app here

  
}); // MAIN MONGO CLOSE
// APP  CONTAINER =========== << 


module.exports = app;
