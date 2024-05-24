import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BucketFilesComponent } from './bucket-files.component';
import { FileService } from '../../core/services/file/file.service';
import { BucketFile } from '../../core/models/file.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BucketFilesComponent', () => {
    let component: BucketFilesComponent;
    let fixture: ComponentFixture<BucketFilesComponent>;
    let fileService: jasmine.SpyObj<FileService>;

    beforeEach(waitForAsync(() => {
        const fileServiceSpy = jasmine.createSpyObj('FileService', ['deleteFile', 'uploadFile']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, BucketFilesComponent],
            providers: [{ provide: FileService, useValue: fileServiceSpy }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fileService = TestBed.inject(FileService) as jasmine.SpyObj<FileService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BucketFilesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display total files', () => {
        component.files = [
            {
                id: 1,
                name: 'File 1',
                bucketId: 1,
                locationId: 1,
                size: 100,
                type: 'text/plain',
                lastModified: new Date(),
                content: 'content',
            },
            {
                id: 2,
                name: 'File 2',
                bucketId: 1,
                locationId: 1,
                size: 200,
                type: 'text/plain',
                lastModified: new Date(),
                content: 'content',
            },
        ];
        fixture.detectChanges();

        const totalFilesElement = fixture.debugElement.query(By.css('p')).nativeElement;
        expect(totalFilesElement.textContent).toContain('All Files: 2');
    });

    it('should select a file when clicked', () => {
        const file: BucketFile = {
            id: 1,
            name: 'File 1',
            bucketId: 1,
            locationId: 1,
            size: 100,
            type: 'text/plain',
            lastModified: new Date(),
            content: 'content',
        };
        component.files = [file];
        fixture.detectChanges();

        const fileRow = fixture.debugElement.query(By.css('tbody tr')).nativeElement;
        fileRow.click();
        fixture.detectChanges();

        expect(component.selectedFile).toBe(file);
    });

    it('should open confirmation modal when delete button is clicked', () => {
        const file: BucketFile = {
            id: 1,
            name: 'File 1',
            bucketId: 1,
            locationId: 1,
            size: 100,
            type: 'text/plain',
            lastModified: new Date(),
            content: 'content',
        };
        component.files = [file];
        component.selectedFile = file;
        fixture.detectChanges();

        const deleteButton = fixture.debugElement.query(By.css('button')).nativeElement;
        deleteButton.click();

        fixture.detectChanges();

        expect(component.showModal).toBeTrue();
        expect(component.modalMessage).toBe('Do you really want to delete this object?');
    });

    it('should delete a selected file when confirmed', async () => {
        const file: BucketFile = {
            id: 1,
            name: 'File 1',
            bucketId: 1,
            locationId: 1,
            size: 100,
            type: 'text/plain',
            lastModified: new Date(),
            content: 'content',
        };
        component.files = [file];
        component.selectedFile = file;
        component.confirmAction = async () => {
            try {
                await fileService.deleteFile(file.id);
                component.files = component.files.filter((f) => f.id !== file.id);
                component.fileDeleted.emit(file.id);
                component.availableSpaceUpdated.emit();
                component.selectedFile = null;
                component.showModal = false;
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        };

        fixture.detectChanges();

        await component.confirmAction();

        expect(fileService.deleteFile).toHaveBeenCalledWith(file.id);
        expect(component.files.length).toBe(0);
    });

    it('should trigger file input click when upload button is clicked', () => {
        spyOn(component.fileInput.nativeElement, 'click');
        component.triggerFileInput();
        expect(component.fileInput.nativeElement.click).toHaveBeenCalled();
    });
});
