import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private timeoutHandle: any = null;
  private inactivityMilliseconds: number = 0;
  private activityListenerAdded: boolean = false;
  private lastActivityTime: number = 0;
  private throttleDelay: number = 1000; // Solo resetear cada 1 segundo

  constructor(private router: Router) {}

  startSession(milliseconds: number) {
    if (!isBrowser()) return;
    
    this.inactivityMilliseconds = milliseconds;
    this.lastActivityTime = Date.now();
    this.resetInactivityTimer();
    
    // Agregar listeners de actividad solo una vez
    if (!this.activityListenerAdded) {
      this.setupActivityListeners();
      this.activityListenerAdded = true;
    }
  }

  private resetInactivityTimer() {
    if (!isBrowser()) return;
    
    const expireAt = Date.now() + this.inactivityMilliseconds;
    try {
      localStorage.setItem('session_expires', String(expireAt));
    } catch (e) {
      console.error('Error setting session_expires', e);
    }

    // Limpiar timeout anterior
    this.clearTimeout();

    // Programar logout por INACTIVIDAD
    this.timeoutHandle = setTimeout(() => {
      this.logout();
    }, this.inactivityMilliseconds);
  }

  private setupActivityListeners() {
    if (!isBrowser()) return;

    // Eventos que indican que el usuario está activo
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = () => this.onUserActivity();
    
    events.forEach(event => {
      window.addEventListener(event, activityHandler, false);
    });
  }

  private onUserActivity() {
    // Solo reiniciar si hay una sesión activa Y ha pasado suficiente tiempo
    const now = Date.now();
    if (this.inactivityMilliseconds > 0 && (now - this.lastActivityTime) >= this.throttleDelay) {
      this.lastActivityTime = now;
      this.resetInactivityTimer();
    }
  }

  clearTimeout() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
  }

  isSessionValid(): boolean {
    if (!isBrowser()) return false;
    const v = localStorage.getItem('session_expires');
    if (!v) return false;
    const expireAt = Number(v);
    if (isNaN(expireAt)) return false;
    return Date.now() < expireAt;
  }

  logout() {
    // Limpiar flags de actividad
    this.inactivityMilliseconds = 0;
    
    // Clear storage keys used for authentication
    if (isBrowser()) {
      try {
        localStorage.removeItem('usuario');
        localStorage.removeItem('rol');
        localStorage.removeItem('session_expires');
      } catch (e) {
        console.error('Error clearing localStorage on logout', e);
      }
    }
    this.clearTimeout();
    // Navigate to login page
    try {
      this.router.navigate(['/login']);
    } catch (e) {
      // navigation may fail in some contexts
      console.error('Navigation to /login failed', e);
    }
  }
}
