import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { BucketLocation } from '../../models/location.model';

@Injectable({
    providedIn: 'root',
})
export class LocationService {
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

    getLocations(): Observable<BucketLocation[]> {
        return this.http.get<BucketLocation[]>(`${this.apiUrl}/locations`);
    }
}
