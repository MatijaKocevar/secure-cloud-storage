import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BucketHeaderComponent } from './bucket-header.component';
import { CommonModule } from '@angular/common';

describe('BucketHeaderComponent', () => {
    let component: BucketHeaderComponent;
    let fixture: ComponentFixture<BucketHeaderComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, BucketHeaderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BucketHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the bucket name', () => {
        component.bucketName = 'Test Bucket';
        fixture.detectChanges();

        const bucketNameElement = fixture.debugElement.query(By.css('h4')).nativeElement;
        expect(bucketNameElement.textContent).toContain('Test Bucket');
    });

    it('should highlight the correct tab based on selectedTab input', () => {
        component.selectedTab = 'details';
        fixture.detectChanges();

        const filesTab = fixture.debugElement.query(By.css('.nav-link[aria-controls="files-tab"]')).nativeElement;
        const detailsTab = fixture.debugElement.query(By.css('.nav-link[aria-controls="details-tab"]')).nativeElement;

        expect(filesTab.classList).not.toContain('active');
        expect(detailsTab.classList).toContain('active');
    });

    it('should emit the correct tab when a tab is clicked', () => {
        spyOn(component.tabSelected, 'emit');

        const detailsTab = fixture.debugElement.query(By.css('.nav-link[aria-controls="details-tab"]')).nativeElement;
        detailsTab.click();
        fixture.detectChanges();

        expect(component.tabSelected.emit).toHaveBeenCalledWith('details');
    });

    it('should emit the correct tab when a tab is selected via keyboard', () => {
        spyOn(component.tabSelected, 'emit');

        const detailsTab = fixture.debugElement.query(By.css('.nav-link[aria-controls="details-tab"]')).nativeElement;
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        detailsTab.dispatchEvent(event);
        fixture.detectChanges();

        expect(component.tabSelected.emit).toHaveBeenCalledWith('details');
    });
});
