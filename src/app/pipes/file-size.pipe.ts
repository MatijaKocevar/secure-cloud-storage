import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fileSize',
    standalone: true,
})
export class FileSizePipe implements PipeTransform {
    transform(size: number): string {
        if (size >= 1024 * 1024 * 1024) {
            return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
        } else if (size >= 1024 * 1024) {
            return (size / (1024 * 1024)).toFixed(1) + ' MB';
        } else if (size >= 1024) {
            return Math.round(size / 1024) + ' KB';
        } else {
            return size + ' B';
        }
    }
}
