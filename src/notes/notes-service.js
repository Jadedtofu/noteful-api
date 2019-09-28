const NotesService = {
    getAllNotes(knex) {
        return knex.select('*').from('noteful_notes');
    },

    insertFolder(knex, newNote) {
        return knex
            .insert(newNote)
            .into('notefulnotes')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },

    getById(knex, id) {
        return knex
            .from('notefulnotes')
            .select('*')
            .where('id', id)
            .first();
    },

    deleteNote(knex, id) {
        return knex('notefulnotes')
            .where({ id })
            .delete();;
    },

    updateNote(knex, id, newNoteFields) {
        return knex('notefulnotes')
            .where({ id })
            .update(newNoteFields);
    },
};

module.exports = NotesService;