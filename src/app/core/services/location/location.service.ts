import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { BucketLocation } from '../../models/location.model';

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    private apiUrl = environment.apiUrl;
    private host = environment.host;
    private isServer: boolean;

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) platformId: object,
    ) {
        this.isServer = isPlatformServer(platformId);
        if (this.isServer) {
            this.apiUrl = `${this.host}${this.apiUrl}`;
        }
    }

    async getLocations(): Promise<BucketLocation[]> {
        return firstValueFrom(this.http.get<BucketLocation[]>(`${this.apiUrl}/locations`));
    }

    async getLocationById(id: number): Promise<BucketLocation> {
        return firstValueFrom(this.http.get<BucketLocation>(`${this.apiUrl}/locations/${id}`));
    }
}
