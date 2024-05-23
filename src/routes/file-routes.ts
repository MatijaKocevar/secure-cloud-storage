import { Router, Request, Response } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { BucketFile } from '../app/core/models/file.model';
import { BucketLocation } from '../app/core/models/location.model';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fileRouter = Router();
const browserDistFolder = join(__dirname, '../browser');

// API to get files by bucketId
fileRouter.get('/', (req: Request, res: Response) => {
    try {
        const bucketId = parseInt(req.query['bucketId'] as string, 10);
        const data = JSON.parse(
            readFileSync(join(browserDistFolder, 'assets/data/files.json'), 'utf8'),
        ) as BucketFile[];
        const files = data.filter((file) => file.bucketId === bucketId);
        res.json(files);
    } catch (error) {
        console.error('Error reading files.json:', error);
        res.status(500).send('Error reading files.json');
    }
});

// API to upload a file
fileRouter.post('/', (req: Request, res: Response) => {
    try {
        const data = JSON.parse(
            readFileSync(join(browserDistFolder, 'assets/data/files.json'), 'utf8'),
        ) as BucketFile[];
        const locationsData = readFileSync(join(browserDistFolder, 'assets/data/locations.json'), 'utf8');
        const locations: BucketLocation[] = JSON.parse(locationsData);

        const newFile: BucketFile = req.body;
        const location = locations.find((loc) => loc.id === newFile.locationId);

        if (location && location.availableSpace >= newFile.size) {
            newFile.id = data.length ? Math.max(...data.map((f) => f.id)) + 1 : 1;
            data.push(newFile);
            location.availableSpace -= newFile.size;
            writeFileSync(join(browserDistFolder, 'assets/data/files.json'), JSON.stringify(data, null, 2));
            writeFileSync(join(browserDistFolder, 'assets/data/locations.json'), JSON.stringify(locations, null, 2));
            res.json(newFile);
        } else {
            res.status(400).send('Not enough available space to upload the file.');
        }
    } catch (error) {
        console.error('Error updating files.json:', error);
        res.status(500).send('Error updating files.json');
    }
});

// API to delete a file
fileRouter.delete('/:id', (req: Request, res: Response) => {
    try {
        const fileId = parseInt(req.params['id'], 10);
        let data = JSON.parse(readFileSync(join(browserDistFolder, 'assets/data/files.json'), 'utf8')) as BucketFile[];
        const fileToDelete = data.find((file) => file.id === fileId);

        if (fileToDelete) {
            data = data.filter((file) => file.id !== fileId);
            const locationsData = readFileSync(join(browserDistFolder, 'assets/data/locations.json'), 'utf8');
            const locations: BucketLocation[] = JSON.parse(locationsData);
            const location = locations.find((loc) => loc.id === fileToDelete.locationId);

            if (location) {
                location.availableSpace += fileToDelete.size;
                writeFileSync(join(browserDistFolder, 'assets/data/files.json'), JSON.stringify(data, null, 2));
                writeFileSync(
                    join(browserDistFolder, 'assets/data/locations.json'),
                    JSON.stringify(locations, null, 2),
                );
                res.sendStatus(204);
            } else {
                res.status(400).send('Location not found for the file.');
            }
        } else {
            res.status(404).send('File not found.');
        }
    } catch (error) {
        console.error('Error deleting file from files.json:', error);
        res.status(500).send('Error deleting file');
    }
});

export default fileRouter;
