import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BucketService } from '../../core/services/bucket/bucket.service';
import { FileService } from '../../core/services/file/file.service';
import { LocationService } from '../../core/services/location/location.service';
import { Bucket } from '../../core/models/bucket.model';
import { BucketFile } from '../../core/models/file.model';
import { BucketLocation } from '../../core/models/location.model';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-bucket-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, FileSizePipe, ConfirmationModalComponent],
    templateUrl: './bucket-detail.component.html',
    styleUrls: ['./bucket-detail.component.scss'],
})
export class BucketDetailComponent implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef;

    bucket: Bucket | undefined;
    files: BucketFile[] = [];
    selectedTab: 'files' | 'details' = 'files';
    selectedFile: BucketFile | null = null;
    location: BucketLocation | undefined;
    showModal = false;
    modalMessage = '';
    confirmAction: (() => void) | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private bucketService: BucketService,
        private fileService: FileService,
        private locationService: LocationService,
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.bucketService.getBuckets().subscribe((buckets) => {
            this.bucket = buckets.find((b) => b.id === id);
            if (this.bucket) {
                this.loadFiles(this.bucket.id);
                this.loadLocation(this.bucket.locationId);
            }
        });
    }

    selectTab(tab: 'files' | 'details'): void {
        this.selectedTab = tab;
    }

    loadFiles(bucketId: number): void {
        this.fileService.getFiles(bucketId).subscribe((files) => {
            this.files = files;
        });
    }

    loadLocation(locationId: number): void {
        this.locationService.getLocationById(locationId).subscribe((location) => {
            this.location = location;
        });
    }

    getTotalFiles(): number {
        return this.files.length;
    }

    selectFile(file: BucketFile): void {
        this.selectedFile = file;
    }

    deleteSelectedFile(): void {
        if (!this.selectedFile) return;
        this.confirmAction = () => {
            this.fileService.deleteFile(this.selectedFile!.id).subscribe(() => {
                this.files = this.files.filter((file) => file.id !== this.selectedFile!.id);
                this.selectedFile = null;
                this.loadLocation(this.bucket!.locationId);
                this.showModal = false;
            });
        };
        this.modalMessage = 'Do you really want to delete this file?';
        this.showModal = true;
    }

    deleteBucket(): void {
        if (!this.bucket) return;
        this.confirmAction = () => {
            this.bucketService.deleteBucket(this.bucket!.id).subscribe(() => {
                this.router.navigate(['/']);
                this.showModal = false;
            });
        };
        this.modalMessage = 'Do you really want to delete this bucket?';
        this.showModal = true;
    }

    triggerFileInput(): void {
        this.fileInput.nativeElement.click();
    }

    uploadFile(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;

        const file = input.files[0];
        if (this.location && this.location.availableSpace < file.size) {
            alert('Not enough available space to upload the file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64Content = (reader.result as string).split(',')[1];
            const newFile: BucketFile = {
                id: 0,
                name: file.name,
                bucketId: this.bucket!.id,
                locationId: this.bucket!.locationId,
                size: file.size,
                type: file.type,
                createdAt: new Date(),
                updatedAt: new Date(),
                content: base64Content,
            };

            this.fileService.uploadFile(newFile).subscribe((uploadedFile) => {
                this.files.push(uploadedFile);
                this.loadLocation(this.bucket!.locationId);
            });
        };
        reader.readAsDataURL(file);
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
