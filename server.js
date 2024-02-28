const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json());
// Route POST /api/moderation/predict
app.post('/api/moderation/predict', async (req, res) => {
    const { text, language } = req.body;

    try {
        const response = await axios.get(`https://moderation.logora.fr/predict?text=${encodeURIComponent(text)}&language=${encodeURIComponent(language)}`); 
        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route POST /api/moderation/score
app.post('/api/moderation/score', async (req, res) => {
    const { text, language } = req.body;

    try {
        const response = await axios.get(`https://moderation.logora.fr/score?text=${encodeURIComponent(text)}&language=${encodeURIComponent(language)}`);
        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route GET /status
app.get('/status', (req, res) => {
    res.json({ status: 'everything is alright' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
