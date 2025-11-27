import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SessionService } from './services/session.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, IonicModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = signal('TakIn');

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    // If running in browser restore session timer; guard for SSR
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
              // expired already
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
