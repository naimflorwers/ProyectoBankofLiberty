import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Activamos la detección de cambios tradicional (Zone.js)
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Router con configuración estándar
    provideRouter(routes),
    
    // Cliente HTTP para tus peticiones a la API
    provideHttpClient(withFetch())
  ]
};