import express from 'express';
import cors from 'cors';
import { getMetrics } from './controller.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/metrics', getMetrics);

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
