import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const COUNTS_FILE = path.join(__dirname, 'counts.json');

app.use(cors());
app.use(express.json());

// Initialize counts file if not exists
if (!fs.existsSync(COUNTS_FILE)) {
    fs.writeFileSync(COUNTS_FILE, JSON.stringify({ share_click: 0, name_submit: 0 }, null, 2));
}

// Helper to read counts
const getCounts = () => {
    try {
        const data = fs.readFileSync(COUNTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { share_click: 0, name_submit: 0 };
    }
};

// Helper to save counts
const saveCounts = (counts) => {
    fs.writeFileSync(COUNTS_FILE, JSON.stringify(counts, null, 2));
};

// Track Endpoint
app.post('/api/track', (req, res) => {
    const { event } = req.body;
    if (!event || (event !== 'share_click' && event !== 'name_submit')) {
        return res.status(400).json({ error: 'Invalid event' });
    }

    const counts = getCounts();
    counts[event] = (counts[event] || 0) + 1;
    saveCounts(counts);

    res.json({ success: true, counts });
});

// Get Totals Endpoint
app.get('/api/totals', (req, res) => {
    res.json(getCounts());
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback: Serve index.html for any unknown routes
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
