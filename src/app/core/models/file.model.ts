export interface BucketFile {
    id: number;
    name: string;
    bucketId: number;
    locationId: number;
    size: number;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    content: string;
}
