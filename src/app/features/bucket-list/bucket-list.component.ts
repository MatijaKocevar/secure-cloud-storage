import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BucketService } from '../../core/services/bucket.service';
import { Bucket } from '../../core/models/bucket.model';
import { CreateBucketComponent } from '../create-bucket/create-bucket.component';

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

    constructor(private bucketService: BucketService) {}

    ngOnInit(): void {
        console.log('BucketListComponent initialized');
        this.bucketService.getBuckets().subscribe((data) => {
            this.buckets = data;
        });
    }

    onBucketCreated(newBucket: Bucket) {
        this.buckets.push(newBucket);
        this.showCreateForm = false;
    }
}
