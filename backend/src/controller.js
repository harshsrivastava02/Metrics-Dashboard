import { loadMockData } from './parser.js';
import { calculateMetrics } from './metrics.js';

export const getMetrics = (req, res) => {
    try {
        const rawData = loadMockData();
        const metrics = calculateMetrics(rawData);
        res.status(200).json(metrics);
    } catch (error) {
        console.error('Failed to get metrics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
