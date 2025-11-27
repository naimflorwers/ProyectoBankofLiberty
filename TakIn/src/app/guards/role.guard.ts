import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function isSessionValid(): boolean {
  if (!isBrowser()) return false;
  const v = localStorage.getItem('session_expires');
  if (!v) return false;
  const expireAt = Number(v);
  if (isNaN(expireAt)) return false;
  return Date.now() < expireAt;
}

@Injectable({ providedIn: 'root' })
export class ClienteGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(): boolean {
    if (isBrowser()) {
      // Validate session expiration
      if (!isSessionValid()) {
        try { localStorage.removeItem('usuario'); localStorage.removeItem('rol'); localStorage.removeItem('session_expires'); } catch(e) {}
        this.router.navigate(['/login']);
        return false;
      }

      const rol = localStorage.getItem('rol');
      if (rol === 'cliente') {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}

@Injectable({ providedIn: 'root' })
export class EjecutivoGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(): boolean {
    if (isBrowser()) {
      if (!isSessionValid()) {
        try { localStorage.removeItem('usuario'); localStorage.removeItem('rol'); localStorage.removeItem('session_expires'); } catch(e) {}
        this.router.navigate(['/login']);
        return false;
      }

      const rol = localStorage.getItem('rol');
      if (rol === 'ejecutivo') {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}

@Injectable({ providedIn: 'root' })
export class GerenteGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(): boolean {
    if (isBrowser()) {
      if (!isSessionValid()) {
        try { localStorage.removeItem('usuario'); localStorage.removeItem('rol'); localStorage.removeItem('session_expires'); } catch(e) {}
        this.router.navigate(['/login']);
        return false;
      }

      const rol = localStorage.getItem('rol');
      if (rol === 'gerente') {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}

// --- NUEVO GUARDIÁN: Permite acceso a Ejecutivo O Gerente ---
@Injectable({ providedIn: 'root' })
export class EmpleadoGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(): boolean {
    if (isBrowser()) {
      if (!isSessionValid()) {
        try { localStorage.removeItem('usuario'); localStorage.removeItem('rol'); localStorage.removeItem('session_expires'); } catch(e) {}
        this.router.navigate(['/login']);
        return false;
      }

      const rol = localStorage.getItem('rol');
      // Aceptamos si es cualquiera de los dos roles de empleados
      if (rol === 'ejecutivo' || rol === 'gerente') {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}