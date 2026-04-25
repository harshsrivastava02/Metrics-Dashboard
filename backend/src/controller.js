import { loadMockData } from './parser.js';
import { calculateMetrics } from './metrics.js';

export const getMetrics = (req, res) => {
    try {
        const rawData = loadMockData();
        const { developer, month } = req.query;
        const metrics = calculateMetrics(rawData, developer, month);
        res.status(200).json(metrics);
    } catch (error) {
        console.error('Failed to get metrics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getFilters = (req, res) => {
    try {
        const rawData = loadMockData();
        const developers = new Set();
        const months = new Set();
        
        // Extract developers
        rawData.deployments.forEach(d => developers.add(d.developer));
        rawData.prs.forEach(pr => developers.add(pr.developer));
        
        // Extract months (YYYY-MM)
        const extractMonth = (dateString) => dateString ? dateString.substring(0, 7) : null;
        rawData.deployments.forEach(d => { if(d.timestamp) months.add(extractMonth(d.timestamp)) });
        rawData.prs.forEach(pr => { if(pr.mergedAt) months.add(extractMonth(pr.mergedAt)) });
        
        res.status(200).json({
            developers: Array.from(developers).filter(Boolean),
            months: Array.from(months).filter(Boolean).sort()
        });
    } catch (error) {
        console.error('Failed to get filters:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
