const axios = require('axios');

const base = 'http://localhost:3000';

const getRandomEmail = () => `user${Math.floor(Math.random() * 10000)}@example.com`;
const getRandomUsername = () => `user${Math.floor(Math.random() * 10000)}`;

const getRandomNote = () => `This is note content #${Math.floor(Math.random() * 1000)}`;
const getRandomNoteTitle = () => `This is note title #${Math.floor(Math.random() * 1000)}`;

describe('API Tests (Successful)', () => {
    let token = '';
    let noteId = '';

    const email = getRandomEmail();
    const username = getRandomUsername();
    const password = "pass1";

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

    test('Create a note', async () => {
        const response = await axios.post(
            `${base}/notes/create`,
            { title: getRandomNoteTitle(), note: getRandomNote() },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
        noteId = response.data.id;
    });

    test('Get all notes', async () => {
        const response = await axios.get(`${base}/users/notes`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        expect(response.status).toBe(200);

        expect(response.data).toHaveProperty('notes');
        expect(Array.isArray(response.data.notes)).toBe(true);
    });

    test('Get note by ID', async () => {
        const response = await axios.get(`${base}/notes/${noteId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('id', noteId);
    });

    test('Update note title', async () => {
        const response = await axios.put(
            `${base}/notes/update/${noteId}`,
            { title: 'This is new updated title once more' },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        expect(response.status).toBe(200);
    });

    test('Update note message', async () => {
        const response = await axios.put(
            `${base}/notes/update/${noteId}`,
            { message: 'This is new updated message' },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        expect(response.status).toBe(200);
    });

    test('Update entire note', async () => {
        const response = await axios.put(
            `${base}/notes/update/${noteId}`,
            { title: 'Updated title', message: 'Updated message' },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        expect(response.status).toBe(200);
    });
});
