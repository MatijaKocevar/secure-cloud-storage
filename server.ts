import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express, { Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import bootstrap from './src/main.server';
import { Bucket } from './src/app/core/models/bucket.model';
import { BucketFile } from './src/app/core/models/file.model';
import { BucketLocation } from './src/app/core/models/location.model';

// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function app(): express.Express {
    const server = express();
    const serverDistFolder = __dirname;
    const browserDistFolder = resolve(serverDistFolder, '../browser');
    const indexHtml = join(serverDistFolder, 'index.server.html');

    const commonEngine = new CommonEngine();

    server.set('view engine', 'html');
    server.set('views', browserDistFolder);

    server.use(express.json());

    // Helper function to get location name by ID
    const getLocationNameById = (id: number): string => {
        const data = readFileSync(join(browserDistFolder, 'assets/data/locations.json'), 'utf8');
        const locations: BucketLocation[] = JSON.parse(data);
        const location = locations.find((loc) => loc.id === id);
        return location ? location.name : 'Unknown';
    };

    // API to get buckets
    server.get('/api/buckets', (req: Request, res: Response) => {
        try {
            const data = readFileSync(join(browserDistFolder, 'assets/data/buckets.json'), 'utf8');
            const buckets: Bucket[] = JSON.parse(data).map((bucket: Bucket) => ({
                ...bucket,
                locationName: getLocationNameById(bucket.locationId),
            }));
            res.json(buckets);
        } catch (error) {
            console.error('Error reading buckets.json:', error);
            res.status(500).send('Error reading buckets.json');
        }
    });

    // API to create a bucket
    server.post('/api/buckets', (req: Request, res: Response) => {
        try {
            const data = JSON.parse(
                readFileSync(join(browserDistFolder, 'assets/data/buckets.json'), 'utf8'),
            ) as Bucket[];
            const newBucket: Bucket = req.body;
            newBucket.id = data.length ? Math.max(...data.map((b) => b.id)) + 1 : 1;
            data.push(newBucket);
            writeFileSync(join(browserDistFolder, 'assets/data/buckets.json'), JSON.stringify(data, null, 2));
            res.json({
                ...newBucket,
                locationName: getLocationNameById(newBucket.locationId),
            });
        } catch (error) {
            console.error('Error updating buckets.json:', error);
            res.status(500).send('Error updating buckets.json');
        }
    });

    // API to delete a bucket
    server.delete('/api/buckets/:id', (req: Request, res: Response) => {
        try {
            const bucketId = parseInt(req.params['id'], 10);
            let data = JSON.parse(
                readFileSync(join(browserDistFolder, 'assets/data/buckets.json'), 'utf8'),
            ) as Bucket[];
            data = data.filter((bucket) => bucket.id !== bucketId);
            writeFileSync(join(browserDistFolder, 'assets/data/buckets.json'), JSON.stringify(data, null, 2));
            res.sendStatus(204);
        } catch (error) {
            console.error('Error deleting bucket from buckets.json:', error);
            res.status(500).send('Error deleting bucket');
        }
    });

    // API to get files by bucketId
    server.get('/api/files', (req: Request, res: Response) => {
        const bucketId = parseInt(req.query['bucketId'] as string, 10);
        const data = JSON.parse(
            readFileSync(join(browserDistFolder, 'assets/data/files.json'), 'utf8'),
        ) as BucketFile[];
        const files = data.filter((file) => file.bucketId === bucketId);
        res.json(files);
    });

    // API to upload a file
    server.post('/api/files', (req: Request, res: Response) => {
        const data = JSON.parse(
            readFileSync(join(browserDistFolder, 'assets/data/files.json'), 'utf8'),
        ) as BucketFile[];
        const newFile: BucketFile = req.body;
        newFile.id = data.length ? Math.max(...data.map((f) => f.id)) + 1 : 1;
        data.push(newFile);
        writeFileSync(join(browserDistFolder, 'assets/data/files.json'), JSON.stringify(data, null, 2));
        res.json(newFile);
    });

    // API to delete a file
    server.delete('/api/files/:id', (req: Request, res: Response) => {
        const fileId = parseInt(req.params['id'], 10);
        let data = JSON.parse(readFileSync(join(browserDistFolder, 'assets/data/files.json'), 'utf8')) as BucketFile[];
        data = data.filter((file) => file.id !== fileId);
        writeFileSync(join(browserDistFolder, 'assets/data/files.json'), JSON.stringify(data, null, 2));
        res.sendStatus(204);
    });

    // API to get locations
    server.get('/api/locations', (req: Request, res: Response) => {
        const data = readFileSync(join(browserDistFolder, 'assets/data/locations.json'), 'utf8');
        const locations: BucketLocation[] = JSON.parse(data);
        res.json(locations);
    });

    // API to get a location by ID
    server.get('/api/locations/:id', (req: Request, res: Response) => {
        const locationId = parseInt(req.params['id'], 10);
        const data = JSON.parse(
            readFileSync(join(browserDistFolder, 'assets/data/locations.json'), 'utf8'),
        ) as BucketLocation[];
        const location = data.find((loc) => loc.id === locationId);
        if (location) {
            res.json(location);
        } else {
            res.status(404).send('Location not found');
        }
    });

    // Serve static files from /browser
    server.get(
        '*.*',
        express.static(browserDistFolder, {
            maxAge: '1y',
        }),
    );

    // All regular routes use the Angular engine
    server.get('*', (req: Request, res: Response, next: NextFunction) => {
        const { protocol, originalUrl, baseUrl, headers } = req;

        commonEngine
            .render({
                bootstrap,
                documentFilePath: indexHtml,
                url: `${protocol}://${headers.host}${originalUrl}`,
                publicPath: browserDistFolder,
                providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
            })
            .then((html) => res.send(html))
            .catch((err) => next(err));
    });

    return server;
}

function run(): void {
    const port = process.env['PORT'] || 4000;

    const server = app();
    server.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}

run();
