import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BucketService } from './bucket.service';
import { environment } from '../../../../environments/environment';
import { Bucket } from '../../models/bucket.model';
import { PLATFORM_ID } from '@angular/core';

describe('BucketService', () => {
    let service: BucketService;
    let httpMock: HttpTestingController;
    const apiUrl = environment.apiUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BucketService, { provide: PLATFORM_ID, useValue: 'browser' }],
        });

        service = TestBed.inject(BucketService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch buckets', async () => {
        const dummyBuckets: Bucket[] = [
            { id: 1, name: 'Test Bucket 1', locationId: 10, createdAt: new Date(), updatedAt: new Date() },
            { id: 2, name: 'Test Bucket 2', locationId: 10, createdAt: new Date(), updatedAt: new Date() },
        ];

        service.getBuckets().then((buckets) => {
            expect(buckets.length).toBe(2);
            expect(buckets).toEqual(dummyBuckets);
        });

        const req = httpMock.expectOne(`${apiUrl}/buckets`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyBuckets);
    });

    it('should create a bucket', async () => {
        const newBucket: Bucket = {
            id: 3,
            name: 'New Bucket',
            locationId: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        service.createBucket(newBucket).then((bucket) => {
            expect(bucket).toEqual(newBucket);
        });

        const req = httpMock.expectOne(`${apiUrl}/buckets`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newBucket);
        req.flush(newBucket);
    });

    it('should delete a bucket', async () => {
        const bucketId = 1;

        service.deleteBucket(bucketId).then(() => {
            // Verify if the request was made
        });

        const req = httpMock.expectOne(`${apiUrl}/buckets/${bucketId}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });

    it('should set apiUrl correctly for server platform', () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BucketService, { provide: PLATFORM_ID, useValue: 'server' }],
        });

        const serverService = TestBed.inject(BucketService);
        expect(serverService['apiUrl']).toBe(`http://localhost:4000${apiUrl}`);
    });
});
