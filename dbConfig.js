const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const dbUrl = "mongodb://localhost:27017";

module.exports = {mongodb,mongoclient,dbUrl};
