import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CreateBucketComponent } from './create-bucket.component';
import { BucketService } from '../../core/services/bucket/bucket.service';
import { LocationService } from '../../core/services/location/location.service';
import { Bucket } from '../../core/models/bucket.model';
import { BucketLocation } from '../../core/models/location.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateBucketComponent', () => {
    let component: CreateBucketComponent;
    let fixture: ComponentFixture<CreateBucketComponent>;
    let bucketService: jasmine.SpyObj<BucketService>;
    let locationService: jasmine.SpyObj<LocationService>;

    beforeEach(waitForAsync(() => {
        const bucketServiceSpy = jasmine.createSpyObj('BucketService', ['createBucket']);
        const locationServiceSpy = jasmine.createSpyObj('LocationService', ['getLocations']);

        TestBed.configureTestingModule({
            imports: [FormsModule, HttpClientTestingModule, CreateBucketComponent],
            providers: [
                { provide: BucketService, useValue: bucketServiceSpy },
                { provide: LocationService, useValue: locationServiceSpy },
            ],
        }).compileComponents();

        bucketService = TestBed.inject(BucketService) as jasmine.SpyObj<BucketService>;
        locationService = TestBed.inject(LocationService) as jasmine.SpyObj<LocationService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateBucketComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch locations on init', async () => {
        const dummyLocations: BucketLocation[] = [
            { id: 1, name: 'Location 1', size: 100, availableSpace: 50 },
            { id: 2, name: 'Location 2', size: 200, availableSpace: 150 },
        ];

        locationService.getLocations.and.returnValue(Promise.resolve(dummyLocations));

        await component.ngOnInit();

        expect(component.locations.length).toBe(2);
        expect(component.locations).toEqual(dummyLocations);
    });

    it('should create bucket successfully', async () => {
        const dummyBucket: Bucket = {
            id: 1,
            name: 'Bucket 1',
            locationId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        component.bucket = { name: 'Bucket 1', locationId: 1 };
        bucketService.createBucket.and.returnValue(Promise.resolve(dummyBucket));

        spyOn(component.bucketCreated, 'emit');

        await component.createBucket();

        expect(bucketService.createBucket).toHaveBeenCalledWith(
            jasmine.objectContaining({ name: 'Bucket 1', locationId: 1 }),
        );
        expect(component.bucketCreated.emit).toHaveBeenCalledWith(dummyBucket);
        expect(component.bucket).toEqual({ id: 0, name: '', locationId: 0 });
        expect(component.errorMessage).toBe('');
    });

    it('should handle bucket creation error', async () => {
        component.bucket = { name: 'Bucket 1', locationId: 1 };
        bucketService.createBucket.and.returnValue(Promise.reject('Error creating bucket'));

        await component.createBucket();

        expect(bucketService.createBucket).toHaveBeenCalledWith(
            jasmine.objectContaining({ name: 'Bucket 1', locationId: 1 }),
        );
        expect(component.errorMessage).toBe('Error creating bucket');
    });

    it('should submit form', () => {
        component.bucket = { name: 'Bucket 1', locationId: 1 };
        const formElement = fixture.debugElement.query(By.css('form'));
        const formDirective = formElement.injector.get(NgForm);

        spyOn(component, 'createBucket');
        component.onSubmit(formDirective);

        expect(component.submitted).toBe(true);
        expect(component.createBucket).toHaveBeenCalled();
    });
});
