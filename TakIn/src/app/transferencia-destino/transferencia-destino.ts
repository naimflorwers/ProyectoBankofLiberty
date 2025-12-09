import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransferenciasService, Cuenta, TransferenciaRequest } from '../../services/transferencias.service';

@Component({
  selector: 'app-transferencia-destino',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
templateUrl: './transferencia-destino.html',
  styleUrl: './transferencia-destino.css'
})
export class TransferenciaDestino implements OnInit {
  cuentaRemitente: Cuenta | null = null;
  cuentaDestino: string = '';
  monto: number = 0;
  motivo: string = '';
  procesando: boolean = false;
  error: string = '';
  
  // Nuevos campos para comisiones
  comision: number = 0;
  montoTotal: number = 0;
  mostrarDetalleComision: boolean = false;

  constructor(
    private transferenciasService: TransferenciasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Recuperar la cuenta remitente del sessionStorage
    const cuentaGuardada = sessionStorage.getItem('cuentaRemitente');
    if (cuentaGuardada) {
      this.cuentaRemitente = JSON.parse(cuentaGuardada);
    } else {
      // Si no hay cuenta guardada, regresar al paso anterior
      alert('Por favor selecciona una cuenta primero');
      this.router.navigate(['/transferencia']);
    }
  }

  /**
   * Calcular comisión cuando cambia el monto
   */
  onMontoChange(): void {
    if (this.monto > 0) {
      this.transferenciasService.getInfoComision(this.monto).subscribe({
        next: (info) => {
          this.comision = info.comision;
          this.montoTotal = info.montoTotal;
          this.mostrarDetalleComision = true;
        },
        error: (err) => {
          console.error('Error al calcular comisión:', err);
          this.comision = 0;
          this.montoTotal = this.monto;
          this.mostrarDetalleComision = false;
        }
      });
    } else {
      this.comision = 0;
      this.montoTotal = 0;
      this.mostrarDetalleComision = false;
    }
  }

  realizarTransferencia(): void {
    // Validaciones
    if (!this.cuentaRemitente) {
      alert('No se ha seleccionado cuenta de origen');
      return;
    }

    if (!this.cuentaDestino || this.cuentaDestino.trim() === '') {
      alert('Por favor ingresa la cuenta destino');
      return;
    }

    if (this.monto <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }

    // Validar saldo suficiente incluyendo la comisión
    if (this.montoTotal > this.cuentaRemitente.Dinero) {
      alert(`Saldo insuficiente. Necesitas $${this.montoTotal.toFixed(2)} (Monto: $${this.monto.toFixed(2)} + Comisión: $${this.comision.toFixed(2)})`);
      return;
    }

    if (this.cuentaDestino === this.cuentaRemitente.Numcuenta) {
      alert('No puedes transferir a la misma cuenta');
      return;
    }

    this.procesando = true;
    this.error = '';

    const datos: TransferenciaRequest = {
      cuentaRemitente: this.cuentaRemitente.Numcuenta,
      cuentaDestino: this.cuentaDestino,
      monto: this.monto,
      motivo: this.motivo || 'Transferencia'
    };

    this.transferenciasService.realizarTransferencia(datos).subscribe({
      next: (response) => {
        if (response.success) {
          // Guardar los datos de la transferencia exitosa (con comisión)
          sessionStorage.setItem('transferenciaExitosa', JSON.stringify({
            monto: this.monto,
            comision: response.data?.comision || this.comision,
            montoTotal: response.data?.montoTotal || this.montoTotal,
            cuentaDestino: this.cuentaDestino,
            cuentaRemitente: this.cuentaRemitente?.Numcuenta || datos.cuentaRemitente,
            motivo: this.motivo || 'Transferencia',
            fecha: new Date(),
            folio: response.idTransferencia
          }));
          
          // Redirigir a la página de éxito
          this.router.navigate(['/transferencia-exitosa']);
        } else {
          this.error = response.error || 'Error desconocido';
          alert(this.error);
          this.procesando = false;
        }
      },
      error: (err) => {
        console.error('Error en la transferencia:', err);
        this.error = err.error?.error || 'Error al procesar la transferencia';
        alert(this.error);
        this.procesando = false;
      }
    });
  }
}