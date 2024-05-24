import { Router, Request, Response } from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Bucket } from '../app/core/models/bucket.model';
import { BucketFile } from '../app/core/models/file.model';
import { getLocationById } from '../utils/location-utils';
import { BucketLocation } from '../app/core/models/location.model';
import { readJsonFile, writeJsonFile } from '../utils/bucket-utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bucketRouter = Router();
const browserDistFolder = join(__dirname, '../browser');

// API to get buckets
bucketRouter.get('/', async (req: Request, res: Response) => {
    try {
        const data = (await readJsonFile(join(browserDistFolder, 'assets/data/buckets.json'))) as Bucket[];
        const buckets: Bucket[] = await Promise.all(
            data.map(async (bucket: Bucket) => ({
                ...bucket,
                locationName: (await getLocationById(bucket.locationId))?.name || 'Unknown',
            })),
        );

        buckets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        res.json(buckets);
    } catch (error) {
        console.error('Error reading buckets.json:', error);
        res.status(500).send('Error reading buckets.json');
    }
});

// API to create a bucket
bucketRouter.post('/', async (req: Request, res: Response) => {
    try {
        const data = (await readJsonFile(join(browserDistFolder, 'assets/data/buckets.json'))) as Bucket[];
        const newBucket: Bucket = req.body;
        newBucket.id = data.length ? Math.max(...data.map((b) => b.id)) + 1 : 1;
        newBucket.createdAt = new Date();
        newBucket.updatedAt = new Date();
        data.push(newBucket);

        await writeJsonFile(join(browserDistFolder, 'assets/data/buckets.json'), data);

        res.json({
            ...newBucket,
            locationName: (await getLocationById(newBucket.locationId))?.name || 'Unknown',
        });
    } catch (error) {
        console.error('Error updating buckets.json:', error);
        res.status(500).send('Error updating buckets.json');
    }
});

// API to delete a bucket
bucketRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const bucketId = parseInt(req.params['id'], 10);
        let bucketsData = (await readJsonFile(join(browserDistFolder, 'assets/data/buckets.json'))) as Bucket[];
        let filesData = (await readJsonFile(join(browserDistFolder, 'assets/data/files.json'))) as BucketFile[];

        bucketsData = bucketsData.filter((bucket) => bucket.id !== bucketId);

        const filesToDelete = filesData.filter((file) => file.bucketId === bucketId);

        const locationsData = await readJsonFile(join(browserDistFolder, 'assets/data/locations.json'));
        const locations: BucketLocation[] = locationsData;

        for (const file of filesToDelete) {
            const location = locations.find((loc) => loc.id === file.locationId);
            if (location) {
                location.availableSpace += file.size;
            }
        }

        filesData = filesData.filter((file) => file.bucketId !== bucketId);

        await writeJsonFile(join(browserDistFolder, 'assets/data/buckets.json'), bucketsData);
        await writeJsonFile(join(browserDistFolder, 'assets/data/files.json'), filesData);
        await writeJsonFile(join(browserDistFolder, 'assets/data/locations.json'), locations);

        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting bucket from buckets.json:', error);
        res.status(500).send('Error deleting bucket');
    }
});

export default bucketRouter;
