const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const NotesService = require('./notes-service');

const notesRouter = express.Router();
const jsonParser = express.json();

const serializedNote = note => ({
    id: note.id,
    name: xss(note.name),
    date_modified: new Date(note.date_modified),
    folder_id: note.folder_id,
    content: xss(note.content)
});

notesRouter
    .route('/')
    .get((req, res, next) => {
        NotesService.getAllNotes(
            req.app.get('db')
        )
        .then(notes => {
            res.json(notes.map(serializedNote));
        })
        .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const {name, folder_id, content} = req.body;
        const newNote = { name, folder_id, content};

        for(const [key, value] of Object.entries(newNote)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })
            }
        }
        NotesService.insertNote(
            req.app.get('db'),
            newNote
        )
        .then(note => {
            logger.info(`Note with id ${note.id} created`)
            res.status(201)
                .location(path.posix.join(req.originalUrl, `/${note.id}`))
                .json(serializedNote(note));
        })
        .catch(next);
    });

notesRouter
    .route('/:note_id')
    .all((req, res, next) => {
        NotesService.getById(
            req.app.get('db'),
            req.params.note_id
        )
        .then(note => {
            if(!note) {
                return res.status(404).json({
                    error: { message: `Note doesn't exist`}
                });
            }
            res.note = note;  //save note for next middleware
            next();
        })
        .catch(next);
    })
    .get((req, res, next) => {
        res.json(serializedNote(res.note));
    })
    .delete((req, res, next) => {
        NotesService.deleteNote(
            req.app.get('db'),
            req.params.note_id
        )
        .then(()=> {
            logger.info(`Note with id ${req.params.note_id} deleted`)
            res.status(204).end();
        })
        .catch();
    })
    .patch(jsonParser, (req, res, next) => {
        const {name, folder_id, content} = req.body;
        const noteToUpdate = {name, folder_id, content};

        const numberOfvalues = Object.values(noteToUpdate).filter(Boolean).length;
        if(numberOfvalues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain 'name', 'folder_id', and 'content'`
                }
            });
        }

        NotesService.updateNote(
            req.app.get('db'),
            req.params.note_id,
            noteToUpdate
        )
        .then(() => {
            logger.info(`Note with id ${req.params.note_id} updated`);
            res.status(204).end();
        })
        .catch(next);
    });  

module.exports = notesRouter;