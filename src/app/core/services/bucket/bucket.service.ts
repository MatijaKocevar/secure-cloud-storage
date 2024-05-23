import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bucket } from '../../models/bucket.model';
import { environment } from '../../../../environments/environment';
import { isPlatformServer } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class BucketService {
    private apiUrl = environment.apiUrl;
    private isServer: boolean;

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) platformId: object,
    ) {
        this.isServer = isPlatformServer(platformId);
        if (this.isServer) {
            this.apiUrl = `http://localhost:4000${this.apiUrl}`;
        }
    }

    getBuckets(): Observable<Bucket[]> {
        return this.http.get<Bucket[]>(`${this.apiUrl}/buckets`);
    }

    createBucket(bucket: Bucket): Observable<Bucket> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post<Bucket>(`${this.apiUrl}/buckets`, bucket, { headers });
    }
}
