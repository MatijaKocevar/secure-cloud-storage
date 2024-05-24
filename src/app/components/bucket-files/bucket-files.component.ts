import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BucketFile } from '../../core/models/file.model';
import { FileService } from '../../core/services/file/file.service';
import { BucketLocation } from '../../core/models/location.model';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-bucket-files',
    standalone: true,
    imports: [CommonModule, FileSizePipe, ConfirmationModalComponent],
    templateUrl: './bucket-files.component.html',
    styleUrls: ['./bucket-files.component.scss'],
})
export class BucketFilesComponent {
    @Input() files: BucketFile[] = [];
    @Input() bucketId!: number;
    @Input() location!: BucketLocation;
    @Output() fileDeleted = new EventEmitter<number>();
    @Output() availableSpaceUpdated = new EventEmitter<void>();
    @ViewChild('fileInput') fileInput!: ElementRef;
    selectedFile: BucketFile | null = null;
    showModal = false;
    modalMessage = '';
    confirmAction: (() => void) | null = null;

    constructor(private fileService: FileService) {}

    getTotalFiles(): number {
        return this.files.length;
    }

    selectFile(file: BucketFile): void {
        this.selectedFile = file;
    }

    deleteSelectedFile(): void {
        if (!this.selectedFile) return;

        this.confirmAction = async () => {
            try {
                await this.fileService.deleteFile(this.selectedFile!.id);
                this.files = this.files.filter((file) => file.id !== this.selectedFile!.id);
                this.fileDeleted.emit(this.selectedFile!.id);
                this.availableSpaceUpdated.emit();
                this.selectedFile = null;
                this.showModal = false;
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        };
        this.modalMessage = 'Do you really want to delete this object?';
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
        reader.onload = async () => {
            const base64Content = (reader.result as string).split(',')[1];
            const newFile: BucketFile = {
                id: 0,
                name: file.name,
                bucketId: this.bucketId,
                locationId: this.location.id,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified ? new Date(file.lastModified) : new Date(),
                content: base64Content,
            };

            try {
                const uploadedFile = await this.fileService.uploadFile(newFile);
                this.files.push(uploadedFile);
                this.availableSpaceUpdated.emit();
            } catch (error) {
                console.error('Error uploading file:', error);
            }
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
