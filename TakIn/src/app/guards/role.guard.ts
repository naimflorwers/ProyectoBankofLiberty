import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

@Injectable({ providedIn: 'root' })
export class ClienteGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(): boolean {
    if (isBrowser()) {
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
      const rol = localStorage.getItem('rol');
      if (rol === 'gerente') {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}
