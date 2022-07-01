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


    migrationService.contents();
    cron.schedule('*/30 * * * * mon-fri', () => {

    });

    if (err) console.log(err);
    // start the rest of your app here

  
}); // MAIN MONGO CLOSE
// APP  CONTAINER =========== << 


module.exports = app;
