const express = require('express');

const projectsRouter = require('./data/routers/projectsRouter.js');
const actionsRouter = require('./data/routers/actionsRouter.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send(`<h2>/projects or /actions</h2>`);
});

server.use('/projects', projectsRouter);
server.use('/actions', actionsRouter);

module.exports = server;