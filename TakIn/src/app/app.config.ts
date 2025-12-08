import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';

export const appConfig: ApplicationConfig = {
  providers: [
    // Activamos la detección de cambios tradicional (Zone.js)
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Activamos el Hash (#) para que el celular no se pierda al navegar
    provideRouter(routes, withHashLocation()),
    
    // Cliente HTTP para tus peticiones a la API
    provideHttpClient(withFetch()),
    
    // Proveedor de Ionic
    provideIonicAngular({})
  ]
};