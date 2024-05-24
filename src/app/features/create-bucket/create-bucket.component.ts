import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bucket } from '../../core/models/bucket.model';
import { BucketService } from '../../core/services/bucket/bucket.service';
import { LocationService } from '../../core/services/location/location.service';
import { BucketLocation } from '../../core/models/location.model';

@Component({
    selector: 'app-create-bucket',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './create-bucket.component.html',
    styleUrls: ['./create-bucket.component.scss'],
})
export class CreateBucketComponent implements OnInit {
    @Output() bucketCreated = new EventEmitter<Bucket>();

    bucket: Partial<Bucket> = { id: 0, name: '', locationId: 0 };
    locations: BucketLocation[] = [];
    errorMessage = '';

    constructor(
        private bucketService: BucketService,
        private locationService: LocationService,
    ) {}

    ngOnInit() {
        this.locationService.getLocations().subscribe({
            next: (locations: BucketLocation[]) => {
                this.locations = locations;
            },
            error: (error) => {
                console.error('Error fetching locations', error);
            },
        });
    }

    createBucket() {
        console.log('CreateBucketComponent: createBucket called');
        const observer = {
            next: (createdBucket: Bucket) => {
                this.bucketCreated.emit(createdBucket);
                this.bucket = { id: 0, name: '', locationId: 0 };
                this.errorMessage = '';
            },
            error: () => {
                this.errorMessage = 'Error creating bucket';
            },
        };

        this.bucketService.createBucket(this.bucket as Bucket).subscribe(observer);
    }
}
