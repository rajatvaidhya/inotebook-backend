//Connecting to Database (MongoDB)

const mongoose = require('mongoose')
const mongoURI = "mongodb+srv://vrinxsystem:rajat-123@cluster0.zkbwolf.mongodb.net/iNotebook";




const connectToMongo = () => {

mongoose.connect(mongoURI, () => {

    console.log("Connected to Mongo!");
})

}

module.exports = connectToMongo;