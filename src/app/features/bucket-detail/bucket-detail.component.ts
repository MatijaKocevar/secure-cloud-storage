import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BucketService } from '../../core/services/bucket/bucket.service';
import { FileService } from '../../core/services/file/file.service';
import { LocationService } from '../../core/services/location/location.service';
import { Bucket } from '../../core/models/bucket.model';
import { BucketFile } from '../../core/models/file.model';
import { BucketLocation } from '../../core/models/location.model';
import { FileSizePipe } from '../../pipes/file-size.pipe';

@Component({
    selector: 'app-bucket-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, FileSizePipe],
    templateUrl: './bucket-detail.component.html',
    styleUrls: ['./bucket-detail.component.scss'],
})
export class BucketDetailComponent implements OnInit {
    bucket: Bucket | undefined;
    files: BucketFile[] = [];
    selectedTab: 'files' | 'details' = 'files';
    selectedFile: BucketFile | null = null;
    location: BucketLocation | undefined;

    constructor(
        private route: ActivatedRoute,
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
                this.loadLocation(this.bucket.id);
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
        this.fileService.deleteFile(this.selectedFile.id).subscribe(() => {
            this.files = this.files.filter((file) => file.id !== this.selectedFile!.id);
            this.selectedFile = null;
        });
    }

    uploadFile(): void {
        // TODO: Implement file upload logic
    }
}
