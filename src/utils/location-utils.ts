import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { BucketLocation } from '../app/core/models/location.model';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const browserDistFolder = join(__dirname, '../browser');

export const getLocationById = (id: number): BucketLocation | undefined => {
    const data = readFileSync(join(browserDistFolder, 'assets/data/locations.json'), 'utf8');
    const locations: BucketLocation[] = JSON.parse(data);

    return locations.find((loc) => loc.id === id);
};
