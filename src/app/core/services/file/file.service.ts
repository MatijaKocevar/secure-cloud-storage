import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { File } from '../../models/file.model';

@Injectable({
    providedIn: 'root',
})
export class FileService {
    private filesUrl = 'assets/data/files.json';

    constructor(private http: HttpClient) {}

    getFiles(bucketId: number): Observable<File[]> {
        return this.http.get<File[]>(`${this.filesUrl}?bucketId=${bucketId}`);
    }

    uploadFile(bucketId: number, file: File): Observable<File> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post<File>(this.filesUrl, { ...file, bucketId }, { headers });
    }

    deleteFile(fileId: number): Observable<void> {
        return this.http.delete<void>(`${this.filesUrl}/${fileId}`);
    }
}
