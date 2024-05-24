import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
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

    async getBuckets(): Promise<Bucket[]> {
        return firstValueFrom(this.http.get<Bucket[]>(`${this.apiUrl}/buckets`));
    }

    async createBucket(bucket: Bucket): Promise<Bucket> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        bucket.createdAt = new Date();
        bucket.updatedAt = new Date();
        return firstValueFrom(this.http.post<Bucket>(`${this.apiUrl}/buckets`, bucket, { headers }));
    }

    async deleteBucket(bucketId: number): Promise<void> {
        return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/buckets/${bucketId}`));
    }
}
