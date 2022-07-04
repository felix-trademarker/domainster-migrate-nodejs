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

    let iStudio10 = await rpoIStudio10.getSQLTables()
    var Model = require('./../repositories/_model')


    for (let i=0; i < iStudio10.length; i++) {

        let lastMigrated = await rpoMigrations.getLastMigrate(iStudio10[i].table_name)

        let migrationData = {
            obj : iStudio10[i].table_name,
            page: 1,
            limit: -1,
            flag: true,
            created_at : moment().format()
        }

        await rpoMigrations.put(migrationData)

        // console.log(lastMigrated)
        if (!lastMigrated || lastMigrated.length <= 0) {

            

            console.log("this", iStudio10[i].table_name)
            let defaultModel = new Model(process.env.DBNAME+'.'+iStudio10[i].table_name)

            let dataArr = await rpoIStudio10.getSQL(iStudio10[i].table_name)
            dataArr.forEach(async el => {
                await defaultModel.put(el)
            });

            return;
        }



    }

    // console.log("tables",iStudio10);
    

}
