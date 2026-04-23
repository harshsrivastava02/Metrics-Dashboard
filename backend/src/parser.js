import fs from 'fs';
import path from 'path';

export const loadMockData = () => {
    try {
        const filePath = path.resolve('data', 'mockData.json');
        const rawData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Error reading mock data:", error);
        return {
            deployments: [],
            prs: [],
            issues: [],
            bugs: []
        };
    }
};
