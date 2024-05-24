import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BucketDetailsComponent } from './bucket-details.component';
import { BucketService } from '../../core/services/bucket/bucket.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BucketDetailsComponent', () => {
    let component: BucketDetailsComponent;
    let fixture: ComponentFixture<BucketDetailsComponent>;
    let bucketService: jasmine.SpyObj<BucketService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(waitForAsync(() => {
        const bucketServiceSpy = jasmine.createSpyObj('BucketService', ['deleteBucket']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, FileSizePipe, BucketDetailsComponent],
            providers: [
                { provide: BucketService, useValue: bucketServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        bucketService = TestBed.inject(BucketService) as jasmine.SpyObj<BucketService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BucketDetailsComponent);
        component = fixture.componentInstance;
        component.bucket = { id: 1, name: 'Test Bucket', locationId: 1, createdAt: new Date(), updatedAt: new Date() };
        component.location = { id: 1, name: 'Test Location', size: 1000, availableSpace: 500 };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display bucket details', () => {
        fixture.detectChanges();

        const bucketNameElement = fixture.debugElement.query(
            By.css('.d-flex.align-items-center:nth-child(1) p:nth-child(2)'),
        ).nativeElement;
        const locationElement = fixture.debugElement.query(
            By.css('.d-flex.align-items-center:nth-child(2) p:nth-child(2)'),
        ).nativeElement;
        const sizeElement = fixture.debugElement.query(
            By.css('.d-flex.align-items-center:nth-child(3) p:nth-child(2)'),
        ).nativeElement;

        expect(bucketNameElement.textContent).toBe('Test Bucket');
        expect(locationElement.textContent).toBe('Test Location');
        expect(sizeElement.textContent).toBe('1000 B');
    });

    it('should open confirmation modal when delete button is clicked', () => {
        const deleteButton = fixture.debugElement.query(By.css('.btn-danger')).nativeElement;
        deleteButton.click();
        fixture.detectChanges();

        expect(component.showModal).toBeTrue();
        expect(component.modalMessage).toBe('Do you really want to delete this bucket?');
    });

    it('should call deleteBucket on confirmation', async () => {
        bucketService.deleteBucket.and.returnValue(Promise.resolve());
        spyOn(component.bucketDeleted, 'emit');

        component.deleteBucket();
        fixture.detectChanges();
        await component.onModalConfirm();

        expect(bucketService.deleteBucket).toHaveBeenCalledWith(1);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
        expect(component.bucketDeleted.emit).toHaveBeenCalled();
    });

    it('should close the modal on cancel', () => {
        component.deleteBucket();
        fixture.detectChanges();
        component.onModalCancel();

        expect(component.showModal).toBeFalse();
    });
});
