const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const userRoutes = require('./Routes/UserRoutes');
const taskRoutes = require('./Routes/TaskRoutes');
const cors = require("cors");

const hostname = '127.0.0.1';
const port = process.env.PORT || 8000;

const mongoDB = require('./database/connection');
mongoDB();

app.use(cors());
app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Hi, I am Backend' })
});

app.listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
});