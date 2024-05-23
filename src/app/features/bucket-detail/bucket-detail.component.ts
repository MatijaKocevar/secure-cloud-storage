import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BucketService } from '../../core/services/bucket/bucket.service';
import { FileService } from '../../core/services/file/file.service';
import { Bucket } from '../../core/models/bucket.model';
import { BucketFile } from '../../core/models/file.model';
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
    selectedFile: BucketFile | undefined;
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

    selectFile(file: BucketFile): void {
        this.selectedFile = file;
    }

    deleteSelectedFile(): void {
        if (this.selectedFile) {
            this.fileService.deleteFile(this.selectedFile.id).subscribe(() => {
                this.files = this.files.filter((file) => file.id !== this.selectedFile!.id);
                this.selectedFile = undefined;
            });
        }
    }

    uploadFile(): void {
        // TODO: Implement file upload logic
    }
}
