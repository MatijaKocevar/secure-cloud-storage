import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BucketListComponent } from './bucket-list.component';
import { BucketService } from '../../core/services/bucket/bucket.service';
import { Bucket } from '../../core/models/bucket.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateBucketComponent } from '../create-bucket/create-bucket.component';

describe('BucketListComponent', () => {
    let component: BucketListComponent;
    let fixture: ComponentFixture<BucketListComponent>;
    let bucketService: jasmine.SpyObj<BucketService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const bucketServiceSpy = jasmine.createSpyObj('BucketService', ['getBuckets']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [CommonModule, FormsModule, CreateBucketComponent, BucketListComponent],
            providers: [
                { provide: BucketService, useValue: bucketServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
        }).compileComponents();

        bucketService = TestBed.inject(BucketService) as jasmine.SpyObj<BucketService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BucketListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch buckets on init', async () => {
        const dummyBuckets: Bucket[] = [
            {
                id: 1,
                name: 'Bucket 1',
                locationId: 1,
                locationName: 'Location 1',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 2,
                name: 'Bucket 2',
                locationId: 2,
                locationName: 'Location 2',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        bucketService.getBuckets.and.returnValue(Promise.resolve(dummyBuckets));

        await component.ngOnInit();

        expect(component.buckets.length).toBe(2);
        expect(component.buckets).toEqual(dummyBuckets);
    });

    it('should return correct bucket count', () => {
        component.buckets = [
            {
                id: 1,
                name: 'Bucket 1',
                locationId: 1,
                locationName: 'Location 1',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 2,
                name: 'Bucket 2',
                locationId: 2,
                locationName: 'Location 2',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        expect(component.getBucketCount()).toBe(2);
    });

    it('should add new bucket to the list on bucket creation', () => {
        const newBucket: Bucket = {
            id: 3,
            name: 'New Bucket',
            locationId: 3,
            locationName: 'New Location',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        component.onBucketCreated(newBucket);

        expect(component.buckets.length).toBe(1);
        expect(component.buckets[0]).toEqual(newBucket);
        expect(component.showCreateForm).toBe(false);
    });

    it('should navigate to bucket detail on bucket click', () => {
        const bucketId = 1;

        component.goToBucketDetail(bucketId);

        expect(router.navigate).toHaveBeenCalledWith(['/bucket', bucketId]);
    });
});
