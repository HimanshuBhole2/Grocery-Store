const initData = require("./data.js");
const mongoose = require("mongoose");
const ListingModel = require("../models/listing.js");


main().then(()=>{
    console.log("Mongo Connection establised");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/shopgrocery');
}


async function dataInsertion(){
    await ListingModel.deleteMany({});
    initData.data =  await initData.data.map((obj)=>({...obj,owner:"65c3b46575a16d39a6561919"}))
    await ListingModel.insertMany(initData.data);
}

dataInsertion();