import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PdfReciboService } from '../../services/pdf-recibo.service';

interface DatosTransferencia {
  monto: number;
  comision: number;
  montoTotal: number;
  cuentaDestino: string;
  cuentaRemitente: string;
  motivo: string;
  fecha: string | Date; // Puede venir como string del JSON
  folio: number;
}

@Component({
  selector: 'app-transferencia-exitosa',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule],
  templateUrl: './transferencia-exitosa.html',
  styleUrl: './transferencia-exitosa.css'
})
export class TransferenciaExitosa implements OnInit {
  datosTransferencia: DatosTransferencia | null = null;

  constructor(
    private router: Router,
    private pdfService: PdfReciboService
  ) {}

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

  descargarRecibo(): void {
    if (!this.datosTransferencia) {
      alert('No hay datos de transferencia disponibles');
      return;
    }

    this.pdfService.generarRecibo({
      idTransferencia: this.datosTransferencia.folio,
      fecha: new Date(this.datosTransferencia.fecha),
      cuentaRemitente: this.datosTransferencia.cuentaRemitente,
      cuentaDestino: this.datosTransferencia.cuentaDestino,
      monto: this.datosTransferencia.monto,
      comision: this.datosTransferencia.comision,
      montoTotal: this.datosTransferencia.montoTotal,
      motivo: this.datosTransferencia.motivo
    });
  }

  volver(): void {
    // Limpiar los datos guardados
    sessionStorage.removeItem('cuentaRemitente');
    sessionStorage.removeItem('transferenciaExitosa');
    this.router.navigate(['/menu-cliente']);
  }

  formatearFecha(fecha: string | Date): string {
    const f = new Date(fecha);
    const dia = f.getDate().toString().padStart(2, '0');
    const mes = (f.getMonth() + 1).toString().padStart(2, '0');
    const anio = f.getFullYear();
    const horas = f.getHours().toString().padStart(2, '0');
    const minutos = f.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }
}