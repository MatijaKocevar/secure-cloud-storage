import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FileService } from './file.service';
import { environment } from '../../../../environments/environment';
import { BucketFile } from '../../models/file.model';
import { PLATFORM_ID } from '@angular/core';

describe('FileService', () => {
    let service: FileService;
    let httpMock: HttpTestingController;
    const apiUrl = environment.apiUrl;
    const host = environment.host;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [FileService, { provide: PLATFORM_ID, useValue: 'browser' }],
        });

        service = TestBed.inject(FileService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch files for a bucket', async () => {
        const bucketId = 1;
        const dummyFiles: BucketFile[] = [
            {
                id: 1,
                bucketId,
                locationId: 101,
                name: 'File 1',
                size: 1234,
                type: 'text/plain',
                lastModified: new Date(),
                content: 'Content 1',
            },
            {
                id: 2,
                bucketId,
                locationId: 102,
                name: 'File 2',
                size: 5678,
                type: 'text/plain',
                lastModified: new Date(),
                content: 'Content 2',
            },
        ];

        service.getFiles(bucketId).then((files) => {
            expect(files.length).toBe(2);
            expect(files).toEqual(dummyFiles);
        });

        const req = httpMock.expectOne(`${apiUrl}/files?bucketId=${bucketId}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyFiles);
    });

    it('should upload a file', async () => {
        const newFile: BucketFile = {
            id: 3,
            bucketId: 1,
            locationId: 103,
            name: 'New File',
            size: 123,
            type: 'text/plain',
            lastModified: new Date(),
            content: 'New Content',
        };

        service.uploadFile(newFile).then((file) => {
            expect(file).toEqual(newFile);
        });

        const req = httpMock.expectOne(`${apiUrl}/files`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newFile);
        req.flush(newFile);
    });

    it('should delete a file', async () => {
        const fileId = 1;

        service.deleteFile(fileId).then(() => {
            // Verify if the request was made
        });

        const req = httpMock.expectOne(`${apiUrl}/files/${fileId}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });

    it('should set apiUrl correctly for server platform', () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [FileService, { provide: PLATFORM_ID, useValue: 'server' }],
        });

        const serverService = TestBed.inject(FileService);
        expect(serverService['apiUrl']).toBe(`${host}${apiUrl}`);
    });
});
