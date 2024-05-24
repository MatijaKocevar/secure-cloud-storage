import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { CommonModule } from '@angular/common';

describe('ConfirmationModalComponent', () => {
    let component: ConfirmationModalComponent;
    let fixture: ComponentFixture<ConfirmationModalComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, ConfirmationModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmationModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the correct message', () => {
        component.message = 'Are you sure you want to delete this item?';
        fixture.detectChanges();

        const messageElement = fixture.debugElement.query(By.css('p')).nativeElement;
        expect(messageElement.textContent).toBe('Are you sure you want to delete this item?');
    });

    it('should emit confirm event when confirm button is clicked', () => {
        spyOn(component.confirm, 'emit');

        const confirmButton = fixture.debugElement.query(By.css('.btn-outline-primary')).nativeElement;
        confirmButton.click();

        expect(component.confirm.emit).toHaveBeenCalled();
    });

    it('should emit cancel event when cancel button is clicked', () => {
        spyOn(component.cancel, 'emit');

        const cancelButton = fixture.debugElement.queryAll(By.css('.btn-outline-primary'))[1].nativeElement;
        cancelButton.click();

        expect(component.cancel.emit).toHaveBeenCalled();
    });

    it('should emit cancel event when modal overlay is clicked', () => {
        spyOn(component.cancel, 'emit');

        const overlay = fixture.debugElement.query(By.css('.modal-overlay')).nativeElement;
        overlay.click();

        expect(component.cancel.emit).toHaveBeenCalled();
    });

    it('should emit cancel event when Escape key is pressed', () => {
        spyOn(component.cancel, 'emit');

        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        fixture.debugElement.query(By.css('.modal-overlay')).nativeElement.dispatchEvent(event);

        expect(component.cancel.emit).toHaveBeenCalled();
    });
});
