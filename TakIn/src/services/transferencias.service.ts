import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cuenta {
  Numcuenta: string;
  Banco: string;
  Dinero: number;
  Clabe: string;
  NumTelefono: string;
}

export interface TransferenciaRequest {
  cuentaRemitente: string;
  cuentaDestino: string;
  monto: number;
  motivo?: string;
}

export interface TransferenciaResponse {
  success: boolean;
  mensaje?: string;
  error?: string;
  idTransferencia?: number;
  comision?: number;
  montoTotal?: number;
  data?: {
    cuentaRemitente: string;
    cuentaDestino: string;
    monto: number;
    comision: number;
    montoTotal: number;
    motivo: string;
    fecha: Date;
  };
}

export interface InfoComision {
  monto: number;
  comision: number;
  montoTotal: number;
  descripcion: string;
}

export interface Transferencia {
  IDTransferencia: number;
  NumCuenta: string;
  Monto: number;
  CuentaDestino: string;
  CuentaRemitente: string;
  Motivo: string;
  FechaTransferencia: Date;
  TipoTransferencia?: 'Enviada' | 'Recibida';
}

@Injectable({
  providedIn: 'root'
})
export class TransferenciasService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  /**
   * Obtener cuentas de un cliente
   */
  getCuentasCliente(idUsuario: number): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(`${this.apiUrl}/cuentas/${idUsuario}`);
  }

  /**
   * Realizar una transferencia
   */
  realizarTransferencia(datos: TransferenciaRequest): Observable<TransferenciaResponse> {
    return this.http.post<TransferenciaResponse>(`${this.apiUrl}/transferencia`, datos);
  }

  /**
   * Obtener historial de transferencias
   */
  getHistorialTransferencias(idUsuario: number): Observable<Transferencia[]> {
    return this.http.get<Transferencia[]>(`${this.apiUrl}/historial/${idUsuario}`);
  }

  /**
   * Obtener detalle de una transferencia
   */
  getDetalleTransferencia(idTransferencia: number): Observable<Transferencia> {
    return this.http.get<Transferencia>(`${this.apiUrl}/transferencia/${idTransferencia}`);
  }

  /**
   * Obtener información de comisión para un monto dado
   */
  getInfoComision(monto: number): Observable<InfoComision> {
    return this.http.get<InfoComision>(`${this.apiUrl}/comision?monto=${monto}`);
  }
}
