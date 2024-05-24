import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
    submitted = false;

    constructor(
        private bucketService: BucketService,
        private locationService: LocationService,
    ) {}

    async ngOnInit(): Promise<void> {
        try {
            this.locations = await this.locationService.getLocations();
        } catch (error) {
            console.error('Error fetching locations', error);
        }
    }

    async createBucket() {
        try {
            const createdBucket = await this.bucketService.createBucket(this.bucket as Bucket);
            this.bucketCreated.emit(createdBucket);
            this.bucket = { id: 0, name: '', locationId: 0 };
            this.errorMessage = '';
        } catch (error) {
            console.error('Error creating bucket', error);
            this.errorMessage = 'Error creating bucket';
        }
    }

    onSubmit(form: NgForm) {
        this.submitted = true;

        Object.keys(form.controls).forEach((key) => {
            form.controls[key].markAsTouched();
        });

        let formValid = true;

        if (!this.bucket.name) {
            form.controls['name'].setErrors({ required: true });
            formValid = false;
        }

        if (this.bucket.locationId === 0) {
            form.controls['location'].setErrors({ required: true });
            formValid = false;
        }

        if (!formValid) {
            return;
        }

        this.createBucket();
    }
}
