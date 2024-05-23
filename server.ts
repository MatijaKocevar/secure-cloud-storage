import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express, { Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import bootstrap from './src/main.server';
import { Bucket } from './src/app/core/models/bucket.model';
import { BucketFile } from './src/app/core/models/file.model';

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

    // API to get buckets
    server.get('/api/buckets', (req: Request, res: Response) => {
        const data = readFileSync(join(browserDistFolder, 'assets/data/buckets.json'), 'utf8');
        const buckets: Bucket[] = JSON.parse(data);
        res.json(buckets);
    });

    // API to create a bucket
    server.post('/api/buckets', (req: Request, res: Response) => {
        const data = JSON.parse(readFileSync(join(browserDistFolder, 'assets/data/buckets.json'), 'utf8')) as Bucket[];
        const newBucket: Bucket = req.body;
        newBucket.id = data.length ? Math.max(...data.map((b) => b.id)) + 1 : 1;
        data.push(newBucket);
        writeFileSync(join(browserDistFolder, 'assets/data/buckets.json'), JSON.stringify(data, null, 2));
        res.json(newBucket);
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
