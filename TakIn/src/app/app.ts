import { Component, signal, OnInit } from '@angular/core';
import { SessionService } from './services/session.service';

// --- CAMBIO IMPORTANTE: Importamos los componentes Standalone ---
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  standalone: true, // Esto confirma que es componente independiente
  // --- CAMBIO IMPORTANTE: Agregamos IonApp y IonRouterOutlet aquí ---
  imports: [IonApp, IonRouterOutlet], 
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = signal('TakIn');

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    try {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        const v = localStorage.getItem('session_expires');
        if (v) {
          const expireAt = Number(v);
          if (!isNaN(expireAt)) {
            const remaining = expireAt - Date.now();
            if (remaining > 0) {
              this.sessionService.startSession(remaining);
            } else {
              this.sessionService.logout();
            }
          }
        }
      }
    } catch (e) {
      console.error('Error restoring session timer', e);
    }
  }
}