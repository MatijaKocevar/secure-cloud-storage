import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocationService } from './location.service';
import { environment } from '../../../../environments/environment';
import { BucketLocation } from '../../models/location.model';
import { PLATFORM_ID } from '@angular/core';

describe('LocationService', () => {
    let service: LocationService;
    let httpMock: HttpTestingController;
    const apiUrl = environment.apiUrl;
    const host = environment.host;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LocationService, { provide: PLATFORM_ID, useValue: 'browser' }],
        });

        service = TestBed.inject(LocationService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch all locations', async () => {
        const dummyLocations: BucketLocation[] = [
            { id: 1, name: 'Location 1', size: 1000, availableSpace: 500 },
            { id: 2, name: 'Location 2', size: 2000, availableSpace: 1500 },
        ];

        service.getLocations().then((locations) => {
            expect(locations.length).toBe(2);
            expect(locations).toEqual(dummyLocations);
        });

        const req = httpMock.expectOne(`${apiUrl}/locations`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyLocations);
    });

    it('should fetch a location by id', async () => {
        const dummyLocation: BucketLocation = { id: 1, name: 'Location 1', size: 1000, availableSpace: 500 };

        service.getLocationById(1).then((location) => {
            expect(location).toEqual(dummyLocation);
        });

        const req = httpMock.expectOne(`${apiUrl}/locations/1`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyLocation);
    });

    it('should set apiUrl correctly for server platform', () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LocationService, { provide: PLATFORM_ID, useValue: 'server' }],
        });

        const serverService = TestBed.inject(LocationService);
        expect(serverService['apiUrl']).toBe(`${host}${apiUrl}`);
    });
});
