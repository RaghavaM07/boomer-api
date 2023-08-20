require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const { redirectController } = require('./controllers/links');
const optionalLogin = require('./middleware/optionalLogin');


app.use(express.json());

app.use('/links', require('./routes/links'));
app.use('/auth', require('./routes/auth'));
app.get('/:shortCode', optionalLogin, redirectController);


mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to DB'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Running on http://localhost:${PORT}`);
});