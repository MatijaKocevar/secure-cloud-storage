import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

if (environment.production) {
    enableProdMode();
}

// Set the base href
const baseHref = document.getElementById('base-href');
if (baseHref) {
    baseHref.setAttribute('href', environment.baseHref);
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
