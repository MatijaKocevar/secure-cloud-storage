import { promises as fs } from 'fs';
import { Bucket } from '../app/core/models/bucket.model';
import { BucketFile } from '../app/core/models/file.model';
import { BucketLocation } from '../app/core/models/location.model';

export const readJsonFile = async (filePath: string) => {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
};

export const writeJsonFile = async (filePath: string, data: Bucket[] | BucketFile[] | BucketLocation[]) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};
