import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { BucketFile } from '../../models/file.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class FileService {
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

    async getFiles(bucketId: number): Promise<BucketFile[]> {
        return firstValueFrom(this.http.get<BucketFile[]>(`${this.apiUrl}/files?bucketId=${bucketId}`));
    }

    async uploadFile(file: BucketFile): Promise<BucketFile> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return firstValueFrom(this.http.post<BucketFile>(`${this.apiUrl}/files`, { ...file }, { headers }));
    }

    async deleteFile(fileId: number): Promise<void> {
        return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/files/${fileId}`));
    }
}
