import { Routes } from '@angular/router';
import { BucketListComponent } from './features/bucket-list/bucket-list.component';
import { CreateBucketComponent } from './features/create-bucket/create-bucket.component';
import { BucketDetailComponent } from './features/bucket-detail/bucket-detail.component';

export const routes: Routes = [
    { path: '', component: BucketListComponent },
    { path: 'create', component: CreateBucketComponent },
    { path: 'bucket/:id', component: BucketDetailComponent },
];
