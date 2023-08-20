require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const { redirectController } = require('./controllers/links');


app.use(express.json());

app.use('/links', require('./routes/links'));
app.get('/:shortCode', redirectController);


mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to DB'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Running on http://localhost:${PORT}`);
});