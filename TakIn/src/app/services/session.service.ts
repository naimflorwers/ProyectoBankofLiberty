import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private timeoutHandle: any = null;

  constructor(private router: Router) {}

  startSession(milliseconds: number) {
    if (!isBrowser()) return;
    const expireAt = Date.now() + milliseconds;
    try {
      localStorage.setItem('session_expires', String(expireAt));
    } catch (e) {
      console.error('Error setting session_expires', e);
    }

    // Clear any existing timeout
    this.clearTimeout();

    // Schedule auto-logout
    this.timeoutHandle = setTimeout(() => {
      this.logout();
    }, milliseconds);
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
