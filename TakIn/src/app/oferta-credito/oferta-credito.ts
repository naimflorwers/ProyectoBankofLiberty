import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export interface OfertaCreditoData {
  montoMaximo: number;
  tasaMensual: number;
  plazoMaximo: number;
  elegible: boolean;
  razon?: string;
}

@Component({
  selector: 'app-oferta-credito',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './oferta-credito.html',
  styleUrls: ['./oferta-credito.css']
})
export class OfertaCredito implements OnInit {
  private apiUrl = 'http://localhost:3000/api';
  
  usuario: any = null;
  oferta: OfertaCreditoData | null = null;
  cargando = false;
  errorMsg = '';
  
  // Formulario de solicitud
  mostrarFormulario = false;
  montoSolicitado = 0;
  plazoMeses = 12;
  ingresoMensual = 0;
  gastosMensuales = 0;
  
  // Resultados del cálculo
  pagoMensual = 0;
  totalAPagar = 0;
  capacidadPago = 0;
  aprobado = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Obtener usuario del localStorage
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      this.usuario = JSON.parse(usuarioStr);
      console.log('Usuario cargado:', this.usuario);
      this.verificarElegibilidad();
    } else {
      this.errorMsg = 'No hay sesión activa';
      setTimeout(() => this.router.navigate(['/login']), 2000);
    }
  }

  /**
   * Verificar si el usuario es elegible para crédito
   */
  verificarElegibilidad(): void {
    const userId = this.usuario?.IdUsuario || this.usuario?.IDUsuario;
    
    if (!userId) {
      this.errorMsg = 'No se pudo identificar el usuario';
      return;
    }

    this.cargando = true;
    this.errorMsg = '';

    this.http.get<any>(`${this.apiUrl}/credito/verificar/${userId}`)
      .subscribe({
        next: (response) => {
          this.cargando = false;
          if (response.success) {
            this.oferta = response.data;
          } else {
            this.errorMsg = response.error || 'Error al verificar elegibilidad';
          }
        },
        error: (err) => {
          this.cargando = false;
          console.error('Error al verificar elegibilidad:', err);
          this.errorMsg = err.error?.error || 'Error al verificar elegibilidad';
        }
      });
  }

  /**
   * Mostrar formulario de solicitud
   */
  solicitarCredito(): void {
    this.mostrarFormulario = true;
    if (this.oferta) {
      this.montoSolicitado = this.oferta.montoMaximo;
    }
  }

  /**
   * Calcular pago mensual usando la fórmula
   * Pc = Pr + Pr * i * n
   * Donde:
   * - Pc = Pago total con intereses
   * - Pr = Préstamo (monto solicitado)
   * - i = Tasa de interés mensual (decimal)
   * - n = Número de pagos (meses)
   */
  calcularPago(): void {
    if (!this.oferta || this.montoSolicitado <= 0 || this.plazoMeses <= 0) {
      return;
    }

    const Pr = this.montoSolicitado;
    const i = this.oferta.tasaMensual / 100; // Convertir % a decimal
    const n = this.plazoMeses;

    // Calcular total a pagar con intereses
    this.totalAPagar = Pr + (Pr * i * n);
    
    // Calcular pago mensual
    this.pagoMensual = this.totalAPagar / n;

    // Calcular capacidad de pago
    // Pi = Cm - Σ gastos
    this.capacidadPago = this.ingresoMensual - this.gastosMensuales;

    // Verificar si está aprobado (el pago mensual no debe exceder el 40% del ingreso disponible)
    const maxPago = this.capacidadPago * 0.4;
    this.aprobado = this.pagoMensual <= maxPago && this.capacidadPago > 0;
  }

  /**
   * Enviar solicitud de crédito
   */
  enviarSolicitud(): void {
    if (!this.aprobado) {
      this.errorMsg = 'La solicitud no cumple con los requisitos de capacidad de pago';
      return;
    }

    const userId = this.usuario?.IdUsuario || this.usuario?.IDUsuario;
    
    this.cargando = true;
    this.errorMsg = '';

    const solicitud = {
      idUsuario: userId,
      montoSolicitado: this.montoSolicitado,
      plazoMeses: this.plazoMeses,
      tasaInteres: this.oferta?.tasaMensual || 0,
      pagoMensual: this.pagoMensual,
      totalAPagar: this.totalAPagar,
      ingresoMensual: this.ingresoMensual,
      gastosMensuales: this.gastosMensuales,
      capacidadPago: this.capacidadPago
    };

    this.http.post<any>(`${this.apiUrl}/credito/solicitar`, solicitud)
      .subscribe({
        next: (response) => {
          this.cargando = false;
          if (response.success) {
            alert('¡Solicitud enviada exitosamente! Un ejecutivo revisará tu solicitud pronto.');
            this.router.navigate(['/menu-cliente']);
          } else {
            this.errorMsg = response.error || 'Error al enviar solicitud';
          }
        },
        error: (err) => {
          this.cargando = false;
          console.error('Error al enviar solicitud:', err);
          this.errorMsg = err.error?.error || 'Error al enviar solicitud';
        }
      });
  }

  /**
   * Cerrar modal
   */
  cerrarModal(): void {
    // Emitir evento para cerrar el modal sin navegar
    window.history.back();
  }

  /**
   * Volver a la oferta desde el formulario
   */
  volverAOferta(): void {
    this.mostrarFormulario = false;
  }

  /**
   * Formatear moneda
   */
  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto);
  }
}
