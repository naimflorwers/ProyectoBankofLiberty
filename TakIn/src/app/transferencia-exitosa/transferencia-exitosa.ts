import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface DatosTransferencia {
  monto: number;
  comision: number;
  montoTotal: number;
  cuentaDestino: string;
  fecha: Date;
  folio: number;
}

@Component({
  selector: 'app-transferencia-exitosa',
  imports: [RouterModule, CommonModule],
  templateUrl: './transferencia-exitosa.html',
  styleUrl: './transferencia-exitosa.css'
})
export class TransferenciaExitosa implements OnInit {
  datosTransferencia: DatosTransferencia | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Recuperar los datos de la transferencia del sessionStorage
    const datosGuardados = sessionStorage.getItem('transferenciaExitosa');
    if (datosGuardados) {
      this.datosTransferencia = JSON.parse(datosGuardados);
    } else {
      // Si no hay datos, redirigir al inicio
      this.router.navigate(['/menu-cliente']);
    }
  }

  volver(): void {
    // Limpiar los datos guardados
    sessionStorage.removeItem('cuentaRemitente');
    sessionStorage.removeItem('transferenciaExitosa');
    this.router.navigate(['/menu-cliente']);
  }

  formatearFecha(fecha: Date): string {
    const f = new Date(fecha);
    const dia = f.getDate().toString().padStart(2, '0');
    const mes = (f.getMonth() + 1).toString().padStart(2, '0');
    const anio = f.getFullYear();
    const horas = f.getHours().toString().padStart(2, '0');
    const minutos = f.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }
}
