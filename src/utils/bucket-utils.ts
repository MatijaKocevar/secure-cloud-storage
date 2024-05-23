import { readFileSync, writeFileSync } from 'fs';
import { Bucket } from '../app/core/models/bucket.model';
import { BucketFile } from '../app/core/models/file.model';
import { BucketLocation } from '../app/core/models/location.model';

export const readJsonFile = (filePath: string) => {
    const data = readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

export const writeJsonFile = (filePath: string, data: Bucket[] | BucketFile[] | BucketLocation[]) => {
    writeFileSync(filePath, JSON.stringify(data, null, 2));
};
