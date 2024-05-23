import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bucket } from '../../core/models/bucket.model';
import { BucketService } from '../../core/services/bucket/bucket.service';

@Component({
    selector: 'app-create-bucket',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './create-bucket.component.html',
    styleUrls: ['./create-bucket.component.scss'],
})
export class CreateBucketComponent {
    @Output() bucketCreated = new EventEmitter<Bucket>();

    bucket: Bucket = { id: 0, name: '', location: '' };
    locations = ['Location 1', 'Location 2', 'Location 3'];
    errorMessage = '';

    constructor(private bucketService: BucketService) {}

    createBucket() {
        this.bucketService.createBucket(this.bucket).subscribe(
            (createdBucket) => {
                this.bucketCreated.emit(createdBucket);
                this.bucket = { id: 0, name: '', location: '' };
            },
            (error) => {
                this.errorMessage = 'Error creating bucket';
                console.error('Error creating bucket', error);
            },
        );
    }
}
