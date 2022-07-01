
var ENV = process.env.ENVIRONMENT || 'prod';

module.exports = { 
    mongoURL        : process.env.MongoURILOCAL,
    mongoURLEU      : process.env.MongoURIEU,
    mongoURLAWS      : process.env.MongoURIAWS,
    mongoOptions    : { 
                        useNewUrlParser: true, 
                        useUnifiedTopology: true 
                      },
    mongoDB         : process.env.MongoDb,

};
