import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketDetailComponent } from './bucket-detail.component';

describe('BucketDetailComponent', () => {
    let component: BucketDetailComponent;
    let fixture: ComponentFixture<BucketDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BucketDetailComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BucketDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
