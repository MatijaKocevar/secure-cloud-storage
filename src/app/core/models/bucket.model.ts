export interface Bucket {
    id: number;
    name: string;
    locationId: number;
    locationName?: string;
    createdAt: Date;
    updatedAt: Date;
}
