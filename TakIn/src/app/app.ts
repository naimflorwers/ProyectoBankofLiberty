import { Component, signal, OnInit } from '@angular/core';
import { SessionService } from './services/session.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], 
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