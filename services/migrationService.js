let rpo = require('../repositories/_contents')

exports.contents = async function(req, res, next) {

    console.log("start migrate");
    let test = await rpo.getSQL()

    console.log(test);
}
