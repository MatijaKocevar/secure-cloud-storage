import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bucket } from '../../models/bucket.model';

@Injectable({
    providedIn: 'root',
})
export class BucketService {
    private bucketsUrl = 'assets/data/buckets.json';

    constructor(private http: HttpClient) {}

    getBuckets(): Observable<Bucket[]> {
        return this.http.get<Bucket[]>(this.bucketsUrl);
    }
}
