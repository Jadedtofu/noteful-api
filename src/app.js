require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const foldersRouter = require('./folders/folders-router');
const notesRouter = require('./notes/notes-router');

const app = express();

// const morganOption = (process.env.NODE_ENV === 'production')
const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

/*--- app.use /api routes and routers here --*/
app.use('/api/folders', foldersRouter);
app.use('/api/notes', notesRouter);

app.get('/', (req, res) => {
    res.send('Hey there!');
});

app.get('/silly', (req, res) => {
    res.send('This is silly')
});

app.use(function errorHandler(error, req, res, next) {
    let response;
    // if (process.env.NODE_ENV === 'production') {
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error'}}
    } else {
        console.error(error);
        response = { message: error.message, error}
    }
    res.status(500).json(response);
});

module.exports = app;
