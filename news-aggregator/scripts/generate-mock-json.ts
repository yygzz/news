import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mockNewsData } from '../src/data/mockNews';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '..', 'public', 'data');
fs.mkdirSync(outputDir, { recursive: true });

const outputPath = path.join(outputDir, 'mock-news.json');
fs.writeFileSync(outputPath, JSON.stringify(mockNewsData, null, 2));

console.log(`Generated ${outputPath}`);
