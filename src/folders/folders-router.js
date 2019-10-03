const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const FoldersService = require('./folders-service');

const foldersRouter = express.Router();
const jsonParser = express.json();

const serializedFolder = folder => ({
    id: folder.id,
    name: xss(folder.name)
});

foldersRouter
    .route('/')
    .get((req, res, next) => {
        FoldersService.getAllFolders(
            req.app.get('db')
        )
        .then(folders => {
            res.json(folders.map(serializedFolder));
        })
        .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const { name } = req.body;
        const newFolder = { name };

        for (const input of ['name']) {
            if (!req.body[input]) {
                logger.error(`Missing '${input} in request body`);
                return res.status(400).json({
                    error: {message: `Missing '${input}' in request body`} 
                });
            }
        }
        FoldersService.insertFolder(
            req.app.get('db'),
            newFolder
        )
        .then(folder => {
            logger.info(`Folder with id ${folder.id} created`);
            res.status(201)
                .location(path.posix.join(req.originalUrl, `/${folder.id}`))
                .json(serializedFolder(folder));
        })
        .catch(next);
    });

foldersRouter
    .route('/:folder_id')
    .all((req, res, next) => {  // for all methods GET, DELETE, etc.
        FoldersService.getById(
            req.app.get('db'),
            req.params.folder_id
        )
        .then(folder => {
            if(!folder) {
                return res.status(404).json({
                    error: { message: `Folder doesn't exist`}
                });
            }
            res.folder = folder; // save folder for next middleware
            next(); // go to next middleware
        })
        .catch(next);
    })
    .get((req, res, next) => {
        res.json(serializedFolder(res.folder));  // get the folder
    })
    .delete((req, res, next) => {
        FoldersService.deleteFolder(
            req.app.get('db'),
            req.params.folder_id
        )
        .then(() => {
            logger.info(`Folder with id ${req.params.folder_id} deleted`);
            res.status(204).end();
        })
        .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const { name } = req.body;
        const folderToUpdate = { name };

        const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length;
        if(numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain 'name'`
                }
            });
        }

        FoldersService.updateFolder(
            req.app.get('db'),
            req.params.folder_id,
            folderToUpdate
        )
        .then(() => {
            logger.info(`Folder with id ${req.params.folder_id} updated`);
            res.status(204).end();
        })
        .catch(next);
    });

module.exports = foldersRouter;