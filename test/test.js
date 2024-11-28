const axios = require('axios');

const base = 'http://localhost:3000';

const getRandomEmail = () => `user${Math.floor(Math.random() * 10000)}@example.com`;
const getRandomUsername = () => `user${Math.floor(Math.random() * 10000)}`;

const getRandomNote = () => `This is note content #${Math.floor(Math.random() * 1000)}`;
const getRandomNoteTitle = () => `This is note title #${Math.floor(Math.random() * 1000)}`;

describe('API Tests (Successful)', () => {
    let token = '';
    let noteId1 = '';
    let noteId2 = '';

    const email = getRandomEmail();
    const username = getRandomUsername();
    const password = 'pass1';

    test('Register user', async () => {
        const response = await axios.post(`${base}/users/register`, {
            username,
            password,
            email
        });

        expect(response.status).toBe(201);
    });

    test('Login user', async () => {
        const response = await axios.post(`${base}/users/login`, {
            password,
            email
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('token');
        token = response.data.token;
    });

    test('Create a note 1', async () => {
        const response = await axios.post(
            `${base}/notes/create`,
            { title: getRandomNoteTitle(), note: getRandomNote() },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
        noteId1 = response.data.id;
    });

    test('Create a note 2', async () => {
        const response = await axios.post(
            `${base}/notes/create`,
            { title: getRandomNoteTitle(), note: getRandomNote() },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
        noteId2 = response.data.id;
    });

    test('Get all notes', async () => {
        const response = await axios.get(`${base}/users/notes`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        expect(response.status).toBe(200);

        expect(response.data).toHaveProperty('notes');
        expect(Array.isArray(response.data.notes)).toBe(true);
        expect(response.data.notes.length).toBe(2);
    });

    test('Get note by ID', async () => {
        const response = await axios.get(`${base}/notes/${noteId1}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('id', noteId1);
    });

    test('Delete Note', async () => {
        const response = await axios.delete(`${base}/notes/delete/${noteId1}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        expect(response.status).toBe(200);
    });

    test('Get deleted note', async () => {
        try {
            const response = await axios.get(`${base}/notes/${noteId1}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            expect(response.status).toBe(404);
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });

    test('Get all notes', async () => {
        const response = await axios.get(`${base}/users/notes`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        expect(response.status).toBe(200);

        expect(response.data).toHaveProperty('notes');
        expect(Array.isArray(response.data.notes)).toBe(true);
        expect(response.data.notes.length).toBe(1);
    });

    test('Update note title', async () => {
        const response = await axios.put(
            `${base}/notes/update/${noteId2}`,
            { title: 'This is new updated title once more' },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        expect(response.status).toBe(200);
    });

    test('Update note message', async () => {
        const response = await axios.put(
            `${base}/notes/update/${noteId2}`,
            { message: 'This is new updated message' },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        expect(response.status).toBe(200);
    });

    test('Update entire note', async () => {
        const response = await axios.put(
            `${base}/notes/update/${noteId2}`,
            { title: 'Updated title', message: 'Updated message' },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        expect(response.status).toBe(200);
    });
});
