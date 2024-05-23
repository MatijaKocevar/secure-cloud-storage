import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { File } from '../../models/file.model';
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

    getFiles(bucketId: number): Observable<File[]> {
        return this.http.get<File[]>(`${this.apiUrl}/files?bucketId=${bucketId}`);
    }

    uploadFile(bucketId: number, file: File): Observable<File> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post<File>(`${this.apiUrl}/files`, { ...file, bucketId }, { headers });
    }

    deleteFile(fileId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/files/${fileId}`);
    }
}
