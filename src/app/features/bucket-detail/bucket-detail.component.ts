import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BucketService } from '../../core/services/bucket/bucket.service';
import { FileService } from '../../core/services/file/file.service';
import { Bucket } from '../../core/models/bucket.model';
import { File } from '../../core/models/file.model';

@Component({
    selector: 'app-bucket-detail',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './bucket-detail.component.html',
    styleUrls: ['./bucket-detail.component.scss'],
})
export class BucketDetailComponent implements OnInit {
    bucket: Bucket | undefined;
    files: File[] = [];
    selectedTab: 'files' | 'details' = 'files';

    constructor(
        private route: ActivatedRoute,
        private bucketService: BucketService,
        private fileService: FileService,
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.bucketService.getBuckets().subscribe((buckets) => {
            this.bucket = buckets.find((b) => b.id === id);
            if (this.bucket) {
                this.loadFiles(this.bucket.id);
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

    getTotalFiles(): number {
        return this.files.length;
    }

    deleteFile(fileId: number): void {
        this.fileService.deleteFile(fileId).subscribe(() => {
            this.files = this.files.filter((file) => file.id !== fileId);
        });
    }

    uploadFile(): void {
        // TODO: Implement file upload logic
    }
}
