import { Router, Request, Response } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Bucket } from '../app/core/models/bucket.model';
import { BucketFile } from '../app/core/models/file.model';
import { getLocationById } from '../utils/location-utils';
import { BucketLocation } from '../app/core/models/location.model';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bucketRouter = Router();
const browserDistFolder = join(__dirname, '../browser');

// API to get buckets
bucketRouter.get('/', (req: Request, res: Response) => {
    try {
        const data = readFileSync(join(browserDistFolder, 'assets/data/buckets.json'), 'utf8');
        const buckets: Bucket[] = JSON.parse(data).map((bucket: Bucket) => ({
            ...bucket,
            locationName: getLocationById(bucket.locationId)?.name || 'Unknown',
        }));
        res.json(buckets);
    } catch (error) {
        console.error('Error reading buckets.json:', error);
        res.status(500).send('Error reading buckets.json');
    }
});

// API to create a bucket
bucketRouter.post('/', (req: Request, res: Response) => {
    try {
        const data = JSON.parse(readFileSync(join(browserDistFolder, 'assets/data/buckets.json'), 'utf8')) as Bucket[];
        const newBucket: Bucket = req.body;
        newBucket.id = data.length ? Math.max(...data.map((b) => b.id)) + 1 : 1;
        data.push(newBucket);
        writeFileSync(join(browserDistFolder, 'assets/data/buckets.json'), JSON.stringify(data, null, 2));
        res.json({
            ...newBucket,
            locationName: getLocationById(newBucket.locationId)?.name || 'Unknown',
        });
    } catch (error) {
        console.error('Error updating buckets.json:', error);
        res.status(500).send('Error updating buckets.json');
    }
});

// API to delete a bucket
bucketRouter.delete('/:id', (req: Request, res: Response) => {
    try {
        const bucketId = parseInt(req.params['id'], 10);
        let bucketsData = JSON.parse(
            readFileSync(join(browserDistFolder, 'assets/data/buckets.json'), 'utf8'),
        ) as Bucket[];
        let filesData = JSON.parse(
            readFileSync(join(browserDistFolder, 'assets/data/files.json'), 'utf8'),
        ) as BucketFile[];

        bucketsData = bucketsData.filter((bucket) => bucket.id !== bucketId);

        const filesToDelete = filesData.filter((file) => file.bucketId === bucketId);

        const locationsData = readFileSync(join(browserDistFolder, 'assets/data/locations.json'), 'utf8');
        const locations: BucketLocation[] = JSON.parse(locationsData);

        filesToDelete.forEach((file) => {
            const location = locations.find((loc) => loc.id === file.locationId);
            if (location) {
                location.availableSpace += file.size;
            }
        });

        filesData = filesData.filter((file) => file.bucketId !== bucketId);

        writeFileSync(join(browserDistFolder, 'assets/data/buckets.json'), JSON.stringify(bucketsData, null, 2));
        writeFileSync(join(browserDistFolder, 'assets/data/files.json'), JSON.stringify(filesData, null, 2));
        writeFileSync(join(browserDistFolder, 'assets/data/locations.json'), JSON.stringify(locations, null, 2));

        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting bucket from buckets.json:', error);
        res.status(500).send('Error deleting bucket');
    }
});

export default bucketRouter;
