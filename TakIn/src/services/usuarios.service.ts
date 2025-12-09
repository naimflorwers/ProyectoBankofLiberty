import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  
  private apiUrl = '/api';

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

  
  login(correo: string, contrasena: string): Observable<any> {
    
    const correoLimpio = correo.trim().toLowerCase(); 
    const passLimpia = contrasena.trim();             

    return this.http.post(`${this.apiUrl}/login`, { 
        correo: correoLimpio, 
        contrasena: passLimpia 
    });
  }
}