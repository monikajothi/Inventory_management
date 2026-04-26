const mongoose = require("mongoose");
const uri = "mongodb://monikajothi07:HJXUxZZnEwXGtJbT@cluster0-shard-00-00.2sqz0.mongodb.net:27017,cluster0-shard-00-01.2sqz0.mongodb.net:27017,cluster0-shard-00-02.2sqz0.mongodb.net:27017/?ssl=true&replicaSet=atlas-2839c0-shard-0&authSource=admin&appName=Cluster0";


function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };

//HJXUxZZnEwXGtJbT