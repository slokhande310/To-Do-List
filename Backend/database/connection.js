const mongoose = require('mongoose');
require('dotenv').config();

const mongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);                                                   // connect to Atlas URI
        console.log('connection successful');

        const myTasks = await mongoose.connection.db.collection("tasks");
        const myTasksArray = await myTasks.find({}).toArray();

        global.myTasks = myTasksArray;

    } catch (error) {
        console.log(error);
    }
}

module.exports = mongoDB;