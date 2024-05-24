import { Routes } from '@angular/router';
import { BucketListComponent } from './components/bucket-list/bucket-list.component';
import { CreateBucketComponent } from './components/create-bucket/create-bucket.component';
import { BucketDetailComponent } from './components/bucket-detail/bucket-detail.component';

export const routes: Routes = [
    { path: '', component: BucketListComponent },
    { path: 'create', component: CreateBucketComponent },
    { path: 'bucket/:id', component: BucketDetailComponent },
];
export const routes: Routes = [
    { path: '', component: BucketListComponent },
    { path: 'create', component: CreateBucketComponent },
    { path: 'bucket/:id', component: BucketDetailComponent },
];
