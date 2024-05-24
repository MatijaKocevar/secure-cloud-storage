import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BucketDetailComponent } from './bucket-detail.component';
import { BucketService } from '../../core/services/bucket/bucket.service';
import { FileService } from '../../core/services/file/file.service';
import { LocationService } from '../../core/services/location/location.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

describe('BucketDetailComponent', () => {
    let component: BucketDetailComponent;
    let fixture: ComponentFixture<BucketDetailComponent>;
    let bucketService: jasmine.SpyObj<BucketService>;
    let fileService: jasmine.SpyObj<FileService>;
    let locationService: jasmine.SpyObj<LocationService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(waitForAsync(() => {
        const bucketServiceSpy = jasmine.createSpyObj('BucketService', ['getBuckets']);
        const fileServiceSpy = jasmine.createSpyObj('FileService', ['getFiles']);
        const locationServiceSpy = jasmine.createSpyObj('LocationService', ['getLocationById']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [CommonModule, BucketDetailComponent],
            providers: [
                { provide: BucketService, useValue: bucketServiceSpy },
                { provide: FileService, useValue: fileServiceSpy },
                { provide: LocationService, useValue: locationServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        bucketService = TestBed.inject(BucketService) as jasmine.SpyObj<BucketService>;
        fileService = TestBed.inject(FileService) as jasmine.SpyObj<FileService>;
        locationService = TestBed.inject(LocationService) as jasmine.SpyObj<LocationService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BucketDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize bucket details, files, and location on init', async () => {
        const bucket = { id: 1, name: 'Test Bucket', locationId: 1, createdAt: new Date(), updatedAt: new Date() };
        const files = [
            {
                id: 1,
                name: 'Test File',
                bucketId: 1,
                locationId: 1,
                size: 100,
                type: 'text/plain',
                lastModified: new Date(),
                content: 'content',
            },
        ];
        const location = { id: 1, name: 'Test Location', size: 1000, availableSpace: 500 };

        bucketService.getBuckets.and.returnValue(Promise.resolve([bucket]));
        fileService.getFiles.and.returnValue(Promise.resolve(files));
        locationService.getLocationById.and.returnValue(Promise.resolve(location));

        await component.ngOnInit();
        fixture.detectChanges();

        expect(component.bucket).toEqual(bucket);
        expect(component.files).toEqual(files);
        expect(component.location).toEqual(location);
    });

    it('should select tab', () => {
        component.selectTab('details');
        expect(component.selectedTab).toBe('details');
    });

    it('should load files', async () => {
        const files = [
            {
                id: 1,
                name: 'Test File',
                bucketId: 1,
                locationId: 1,
                size: 100,
                type: 'text/plain',
                lastModified: new Date(),
                content: 'content',
            },
        ];
        fileService.getFiles.and.returnValue(Promise.resolve(files));

        await component.loadFiles(1);
        fixture.detectChanges();

        expect(component.files).toEqual(files);
    });

    it('should load location', async () => {
        const location = { id: 1, name: 'Test Location', size: 1000, availableSpace: 500 };
        locationService.getLocationById.and.returnValue(Promise.resolve(location));

        await component.loadLocation(1);
        fixture.detectChanges();

        expect(component.location).toEqual(location);
    });

    it('should delete file from list', () => {
        const files = [
            {
                id: 1,
                name: 'Test File 1',
                bucketId: 1,
                locationId: 1,
                size: 100,
                type: 'text/plain',
                lastModified: new Date(),
                content: 'content',
            },
            {
                id: 2,
                name: 'Test File 2',
                bucketId: 1,
                locationId: 1,
                size: 200,
                type: 'text/plain',
                lastModified: new Date(),
                content: 'content',
            },
        ];
        component.files = files;

        component.deleteFileFromList(1);
        fixture.detectChanges();

        expect(component.files.length).toBe(1);
        expect(component.files[0].id).toBe(2);
    });

    it('should update available space', async () => {
        const location = { id: 1, name: 'Test Location', size: 1000, availableSpace: 500 };
        locationService.getLocationById.and.returnValue(Promise.resolve(location));

        component.bucket = { id: 1, name: 'Test Bucket', locationId: 1, createdAt: new Date(), updatedAt: new Date() };
        await component.updateAvailableSpace();
        fixture.detectChanges();

        expect(component.location).toEqual(location);
    });

    it('should navigate to root on bucket deleted', () => {
        component.onBucketDeleted();
        expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
});
