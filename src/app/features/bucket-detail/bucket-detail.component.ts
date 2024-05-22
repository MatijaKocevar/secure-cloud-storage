import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BucketService } from '../../core/services/bucket.service';
import { Bucket } from '../../core/models/bucket.model';

interface File {
    id: number;
    name: string;
}

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
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.bucketService.getBuckets().subscribe((buckets) => {
            this.bucket = buckets.find((b) => b.id === id);
            if (this.bucket) {
                // Mock files data
                this.files = [
                    { id: 1, name: 'File 1' },
                    { id: 2, name: 'File 2' },
                ];
            }
        });
    }

    selectTab(tab: 'files' | 'details'): void {
        this.selectedTab = tab;
    }

    getTotalFiles(): number {
        return this.files.length;
    }
}
