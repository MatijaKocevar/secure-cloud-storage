import { Routes } from '@angular/router';
import { BucketListComponent } from './features/bucket-list/bucket-list.component';
import { CreateBucketComponent } from './features/create-bucket/create-bucket.component';

export const routes: Routes = [
  { path: '', component: BucketListComponent },
  { path: 'create', component: CreateBucketComponent }
];
