let rpo = require('../repositories/_contents')
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
