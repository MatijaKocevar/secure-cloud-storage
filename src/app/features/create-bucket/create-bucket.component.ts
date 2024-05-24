import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bucket } from '../../core/models/bucket.model';

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

    createBucket() {
        this.bucket.id = Math.floor(Math.random() * 1000);
        this.bucketCreated.emit(this.bucket);
        this.bucket = { id: 0, name: '', location: '' };
    }
}
