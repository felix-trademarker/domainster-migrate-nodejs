let rpo = require('../repositories/_contents')
let rpoIStudio10 = require('../repositories/_istudio10')
let rpoMigrations = require('../repositories/_migrations')
let moment = require('moment')

exports.contents = async function(req, res, next) {

    let page = 1, limit = 100, offset = 0;

    // CHECK MIGRATION DATA
    let lastMigrated = await rpoMigrations.getLastMigrate('whoIsRecord')
    

    if (lastMigrated.length > 0) {
        page = lastMigrated[0].page + 1
        limit = lastMigrated[0].limit

        if (lastMigrated.flag) {
            console.log(" *********** STOP ********** ");
            return;
        }
    }

    let migrationData = {
        obj : 'whoIsRecord',
        page: page,
        limit: limit,
        flag: false,
        created_at : moment().format()
    }

    let records = await rpo.getWhoIsRecord(page,limit)
    
    if (records && records.length) {
        
        await rpoMigrations.put(migrationData)

        console.log("****** start migrate page %d ********",page);
        for (let r=0; r < records.length; r++) {
            let record = records[r];

            let dup = await rpo.findQuery({whois_record_id: record.whois_record_id})
            if (!(dup && dup.length > 0)) {
                // add record
                rpo.put(record)
            }
        }

        
    } else {
        migrationData.flag = true
        await rpoMigrations.put(migrationData)
        console.log("========== STOP DOMAIN MIGRATION, NO DATA FOUND ==========")
    }

    

}

exports.istudio10 = async function() {

    let tables = await rpoIStudio10.getSQLTables()
    var Model = require('./../repositories/_model')


    for (let i=0; i < tables.length; i++) {

        console.log("Migrating >>>", tables[i].table_name)
        let defaultModel = new Model(tables[i].table_name)

        let hastableContentMongo = await defaultModel.getLatest()

        if (!(hastableContentMongo && hastableContentMongo.length > 0)) {
            console.log(" === Fetching SQL Records ===")
            let dataArr = await rpoIStudio10.getSQL(tables[i].table_name)
            console.log("Total fetched records", dataArr.length)

            for (let n=0; n < dataArr.length; n++) {
                let el = dataArr[n]
                await defaultModel.put(el)
                console.log(tables[i].table_name,">> Added ",n +' of '+dataArr.length);
            }
        } else {
            console.log("Skip >>>", tables[i].table_name)
        }

    }

    // console.log("tables",iStudio10);
    

}
