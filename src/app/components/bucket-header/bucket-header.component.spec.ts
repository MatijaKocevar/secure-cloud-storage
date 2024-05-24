import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketHeaderComponent } from './bucket-header.component';

describe('BucketHeaderComponent', () => {
  let component: BucketHeaderComponent;
  let fixture: ComponentFixture<BucketHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BucketHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BucketHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
