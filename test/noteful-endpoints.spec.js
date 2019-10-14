const { expect } = require('chai');
const supertest = require('supertest');
const knex = require('knex');
const app = require('../src/app');

describe(`Noteful endpoints`, function() {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });

    after(`disconnect from db`, () => db.destroy());

    before(`clean the table`, () => db.raw('TRUNCATE noteful_notes, noteful_folders RESTART IDENTITY CASCADE'));

    afterEach(`cleanup`, () => db.raw('TRUNCATE noteful_notes, noteful_folders RESTART IDENTIDY CASCADE'));

    describe(`GET /api/folders`, () => {
        context(`Given no folders`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/folders')
                    .expect(200, []);
            });
        });
    });
});