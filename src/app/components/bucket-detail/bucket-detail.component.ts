import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BucketService } from '../../core/services/bucket/bucket.service';
import { FileService } from '../../core/services/file/file.service';
import { LocationService } from '../../core/services/location/location.service';
import { Bucket } from '../../core/models/bucket.model';
import { BucketFile } from '../../core/models/file.model';
import { BucketLocation } from '../../core/models/location.model';
import { BucketHeaderComponent } from '../bucket-header/bucket-header.component';
import { BucketFilesComponent } from '../bucket-files/bucket-files.component';
import { BucketDetailsComponent } from '../bucket-details/bucket-details.component';

@Component({
    selector: 'app-bucket-detail',
    standalone: true,
    imports: [CommonModule, BucketHeaderComponent, BucketFilesComponent, BucketDetailsComponent],
    templateUrl: './bucket-detail.component.html',
    styleUrls: ['./bucket-detail.component.scss'],
})
export class BucketDetailComponent implements OnInit {
    bucket: Bucket | undefined;
    files: BucketFile[] = [];
    selectedTab: 'files' | 'details' = 'files';
    location: BucketLocation | undefined;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
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
                this.loadLocation(this.bucket.locationId);
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

    deleteFileFromList(fileId: number): void {
        this.files = this.files.filter((file) => file.id !== fileId);
        if (this.bucket) {
            this.loadLocation(this.bucket.locationId);
        }
    }

    updateAvailableSpace(): void {
        if (this.bucket) {
            this.loadLocation(this.bucket.locationId);
        }
    }

    onBucketDeleted(): void {
        this.router.navigate(['/']);
    }
}
