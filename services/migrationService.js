let rpo = require('../repositories/_contents')
let rpoMigrations = require('../repositories/_migrations')
let moment = require('moment')

exports.contents = async function(req, res, next) {

    // CHECK MIGRATION DATA
    let lastMigrated = await rpoMigrations.getLastMigrate('whoIsRecord1')
    let page = 1, limit = 2, offset = 0;

    if (lastMigrated.length > 0) {
        page = lastMigrated[0].page + 1
        limit = lastMigrated[0].limit
    }

    let migrationData = {
        obj : 'whoIsRecord1',
        page: page,
        limit: limit,
        created_at : moment().format()
    }

    

    console.log("****** start migrate page %d ********",page);
    let records = await rpo.getWhoIsRecord(page,limit)

    if (records && records.length) {
        
        for (let r=0; r < records.length; r++) {
            let record = records[r];

            let dup = await rpo.findQuery({whois_record_id: record.whois_record_id})
            if (!(dup && dup.length > 0)) {
                // add record
                rpo.put(record)
            }
        }

        await rpoMigrations.put(migrationData)
    } else {
        console.log("========== STOP DOMAIN MIGRATION, NO DATA FOUND ==========")
    }

}
