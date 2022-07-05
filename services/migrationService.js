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

        // let lastMigrated = await rpoMigrations.getLastMigrate(iStudio10[i].table_name)

        // console.log(lastMigrated)
        // if (!lastMigrated || lastMigrated.length <= 0) {

        //     let migrationData = {
        //         obj : iStudio10[i].table_name,
        //         page: 1,
        //         limit: -1,
        //         flag: true,
        //         created_at : moment().format()
        //     }
    
        //     await rpoMigrations.put(migrationData)

        //     console.log("this", iStudio10[i].table_name)
        //     let defaultModel = new Model(process.env.DBNAME+'.'+iStudio10[i].table_name)

        //     let dataArr = await rpoIStudio10.getSQL(iStudio10[i].table_name)
        //     dataArr.forEach(async el => {

        //         if (el && el.id) {
        //             let dup = defaultModel.findQuery({id : el.id})

        //             if (!(dup && dup.leng > 0)) {
        //                 await defaultModel.put(el)
        //             }

        //         } else {
        //             // ID IS NOT PRESENT
        //             await defaultModel.put(el)
        //         }

        //     });

        //     return;
        // }

        if ( iStudio10[i].table_name == "aliases" 
          || iStudio10[i].table_name == "announcement" 
          || iStudio10[i].table_name == "applicant" 
        ) {
            console.log(" << SKIP %S >>", iStudio10[i].table_name);
            // return;
        } else {
            // blast migration, call only once
            console.log("Migrating >>>", iStudio10[i].table_name)
            let defaultModel = new Model(process.env.DBNAME+'.'+iStudio10[i].table_name)

            let dataArr = await rpoIStudio10.getSQL(iStudio10[i].table_name)
            console.log("Total fetched records", dataArr.length)

            let count = 1;
            dataArr.forEach(async el => {
                await defaultModel.put(el)
                console.log("added ",count++);
            });
        }


        



    }

    // console.log("tables",iStudio10);
    

}
