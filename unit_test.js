const assert = require('assert');
const axios = require('axios');
const express = require('express');
const { spawn } = require('child_process');
const { before, describe, it } = require('mocha');
const app = express();
const PORT = 3000;
let serverProcess;
// Démarrer le serveur avant de lancer les tests
before(function (done) {
    serverProcess = spawn('node', ['server.js']);
    
    serverProcess.stdout.on('data', (data) => {
        console.log(`Serveur: ${data}`);
        if (data.includes('Server is running on port')) {
            console.log('Serveur démarré avec succès.');
            done();
        }
    });
    
    serverProcess.stderr.on('data', (data) => {
        console.error(`Erreur lors du démarrage du serveur: ${data}`);
        done(data);
    });
});

// Test suite for /api/moderation/predict endpoint
describe('POST /api/moderation/predict', function () {
    it('should return moderation prediction', async function () {
        const response = await axios.post(`http://localhost:${PORT}/api/moderation/predict`, {
            text: 'Exemple texte',
            language: 'FR'
        });
        assert.strictEqual(response.status, 200);
        assert.strictEqual(typeof response.data.prediction, 'object');
    });
});

// Test suite for /api/moderation/score endpoint
describe('POST /api/moderation/score', function () {
    it('should return moderation score', async function () {
        const response = await axios.post(`http://localhost:${PORT}/api/moderation/score`, {
            text: 'Exemple texte',
            language: 'FR'
        });
        assert.strictEqual(response.status, 200);
        assert.strictEqual(typeof response.data.score, 'number');
    });
});

// Test suite for /status endpoint
describe('GET /status', function () {
    it('should return status message', async function () {
        const response = await axios.get(`http://localhost:${PORT}/status`);
        assert.strictEqual(response.status, 200);
        assert.deepStrictEqual(response.data, { status: 'everything is alright' });
    });
});

// Arrêter le serveur après les tests
after(function (done) {
    serverProcess.kill();
    console.log('Serveur arrêté avec succès.');
    done();
});
