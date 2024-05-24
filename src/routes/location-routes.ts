import { Router, Request, Response } from 'express';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { BucketLocation } from '../app/core/models/location.model';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const locationRouter = Router();
const browserDistFolder = join(__dirname, '../browser');

// API to get locations
locationRouter.get('/', async (req: Request, res: Response) => {
    try {
        const data = await fs.readFile(join(browserDistFolder, 'assets/data/locations.json'), 'utf8');
        const locations: BucketLocation[] = JSON.parse(data);

        res.json(locations);
    } catch (error) {
        console.error('Error reading locations.json:', error);
        res.status(500).send('Error reading locations.json');
    }
});

// API to get a location by ID
locationRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const locationId = parseInt(req.params['id'], 10);
        const data = JSON.parse(
            await fs.readFile(join(browserDistFolder, 'assets/data/locations.json'), 'utf8'),
        ) as BucketLocation[];
        const location = data.find((loc) => loc.id === locationId);

        if (location) {
            res.json(location);
        } else {
            res.status(404).send('Location not found');
        }
    } catch (error) {
        console.error('Error reading location from locations.json:', error);
        res.status(500).send('Error reading location');
    }
});

export default locationRouter;
