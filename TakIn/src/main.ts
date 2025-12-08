import { bootstrapApplication } from '@angular/platform-browser';

// IMPORTANTE: Esta línea es la que arregla la pantalla gris en Ionic
import 'zone.js';

import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));