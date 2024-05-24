import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bucket } from '../../core/models/bucket.model';
import { BucketLocation } from '../../core/models/location.model';
import { BucketService } from '../../core/services/bucket/bucket.service';
import { Router } from '@angular/router';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-bucket-details',
    standalone: true,
    imports: [CommonModule, FileSizePipe, ConfirmationModalComponent],
    templateUrl: './bucket-details.component.html',
    styleUrls: ['./bucket-details.component.scss'],
})
export class BucketDetailsComponent {
    @Input() bucket!: Bucket;
    @Input() location!: BucketLocation;
    @Output() bucketDeleted = new EventEmitter<void>();
    showModal = false;
    modalMessage = '';
    confirmAction: (() => void) | null = null;

    constructor(
        private bucketService: BucketService,
        private router: Router,
    ) {}

    deleteBucket(): void {
        this.confirmAction = async () => {
            try {
                await this.bucketService.deleteBucket(this.bucket.id);
                this.router.navigate(['/']);
                this.bucketDeleted.emit();
                this.showModal = false;
            } catch (error) {
                console.error('Error deleting bucket:', error);
            }
        };
        this.modalMessage = 'Do you really want to delete this bucket?';
        this.showModal = true;
    }

    onModalConfirm(): void {
        if (this.confirmAction) {
            this.confirmAction();
        }
    }

    onModalCancel(): void {
        this.showModal = false;
    }
}
