const mongoose = require("mongoose");
const uri = "mongodb+srv://sasirekhavl22cse:kJJOGjKBQafJ3g4j@inventorymanagement.hx2rtrv.mongodb.net/?retryWrites=true&w=majority&appName=InventoryManagement";


function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };

//kJJOGjKBQafJ3g4j