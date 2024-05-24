import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Bucket } from '../../core/models/bucket.model';
import { CreateBucketComponent } from '../create-bucket/create-bucket.component';
import { BucketService } from '../../core/services/bucket/bucket.service';

@Component({
    selector: 'app-bucket-list',
    standalone: true,
    imports: [CommonModule, FormsModule, CreateBucketComponent],
    templateUrl: './bucket-list.component.html',
    styleUrls: ['./bucket-list.component.scss'],
})
export class BucketListComponent implements OnInit {
    buckets: Bucket[] = [];
    showCreateForm = false;

    constructor(
        private bucketService: BucketService,
        private router: Router,
    ) {}

    async ngOnInit(): Promise<void> {
        try {
            this.buckets = await this.bucketService.getBuckets();
        } catch (error) {
            console.error('Error fetching buckets:', error);
        }
    }

    getBucketCount(): number {
        return this.buckets.length;
    }

    onBucketCreated(newBucket: Bucket) {
        this.buckets.unshift(newBucket);
        this.showCreateForm = false;
    }

    goToBucketDetail(id: number): void {
        this.router.navigate(['/bucket', id]);
    }
}
