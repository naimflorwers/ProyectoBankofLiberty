import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  // Tu URL real (¡Esto está excelente!)
  private apiUrl = 'http://penyrphf.icu/api';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios`);
  }

  getClientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes`);
  }

  getEjecutivos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ejecutivos`);
  }

  getGerentes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/gerentes`);
  }

  getUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${id}`);
  }

  // --- AQUÍ ESTÁ EL TRUCO ---
  login(correo: string, contrasena: string): Observable<any> {
    // Limpiamos los datos antes de enviarlos
    const correoLimpio = correo.trim().toLowerCase(); // Quita espacios y pasa a minúsculas
    const passLimpia = contrasena.trim();             // Quita espacios accidentales

    return this.http.post(`${this.apiUrl}/login`, { 
        correo: correoLimpio, 
        contrasena: passLimpia 
    });
  }
}