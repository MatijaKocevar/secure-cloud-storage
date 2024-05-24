export interface BucketFile {
    id: number;
    name: string;
    bucketId: number;
    locationId: number;
    size: number;
    type: string;
    lastModified: Date;
    content: string;
}
