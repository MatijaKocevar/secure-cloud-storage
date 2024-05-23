import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-bucket-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './bucket-header.component.html',
    styleUrls: ['./bucket-header.component.scss'],
})
export class BucketHeaderComponent {
    @Input() bucketName!: string;
    @Input() selectedTab: 'files' | 'details' = 'files';
    @Output() tabSelected = new EventEmitter<'files' | 'details'>();

    selectTab(tab: 'files' | 'details'): void {
        this.tabSelected.emit(tab);
    }
}
