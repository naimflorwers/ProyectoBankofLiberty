import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../services/session.service';

interface OfertaCreditoData {
  montoMaximo: number;
  tasaMensual: number;
  plazoMaximo: number;
  elegible: boolean;
  razon?: string;
}

@Component({
  selector: 'app-menu-cliente',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
templateUrl: './menu-cliente.html',
  styleUrl: './menu-cliente.css'
})
export class MenuCliente implements OnInit {
  private apiUrl = 'http://penyrphf.icu:3000/api';
  
  // Control del modal
  mostrarModalCredito = false;
  mostrarFormulario = false;
  cargando = false;
  errorMsg = '';
  
  // Datos del usuario y oferta
  usuario: any = null;
  oferta: OfertaCreditoData | null = null;
  
  // Formulario
  montoSolicitado = 0;
  plazoMeses = 12;
  ingresoMensual = 0;
  gastosMensuales = 0;
  
  // Resultados
  pagoMensual = 0;
  totalAPagar = 0;
  capacidadPago = 0;
  aprobado = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🟢 MenuCliente iniciado');
    
    // Obtener usuario del localStorage
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      this.usuario = JSON.parse(usuarioStr);
      console.log('👤 Usuario cargado:', this.usuario);
    }

    // Verificar si ya se mostró la oferta en esta sesión
    const ofertaMostrada = sessionStorage.getItem('ofertaCreditoMostrada');
    console.log('📋 Oferta ya mostrada?', ofertaMostrada);
    
    if (!ofertaMostrada) {
      // Mostrar oferta después de 2 segundos
      console.log('⏱️ Esperando 2 segundos para verificar elegibilidad...');
      setTimeout(() => {
        console.log('🔍 Verificando elegibilidad ahora...');
        this.verificarElegibilidad();
      }, 2000);
    }
  }

  verificarElegibilidad(): void {
    const userId = this.usuario?.IdUsuario || this.usuario?.IDUsuario;
    console.log('🆔 UserId:', userId);
    
    if (!userId) {
      console.log('❌ No hay userId');
      return;
    }

    this.cargando = true;
    console.log('📡 Llamando a API:', `${this.apiUrl}/credito/verificar/${userId}`);

    this.http.get<any>(`${this.apiUrl}/credito/verificar/${userId}`)
      .subscribe({
        next: (response) => {
          console.log('📥 Respuesta recibida:', response);
          this.cargando = false;
          if (response.success && response.data.elegible) {
            console.log('✅ Usuario elegible! Mostrando modal...');
            this.oferta = response.data;
            this.mostrarModalCredito = true;
            sessionStorage.setItem('ofertaCreditoMostrada', 'true');
            console.log('🔵 mostrarModalCredito:', this.mostrarModalCredito);
            console.log('💰 Oferta:', this.oferta);
            
            // Forzar detección de cambios
            this.cdr.detectChanges();
            
          } else {
            console.log('⚠️ Usuario NO elegible:', response.data?.razon);
          }
        },
        error: (err) => {
          console.log('❌ Error en petición:', err);
          this.cargando = false;
        }
      });
  }

  cerrarModal(): void {
    this.mostrarModalCredito = false;
    this.mostrarFormulario = false;
  }

  solicitarCredito(): void {
    this.mostrarFormulario = true;
    if (this.oferta) {
      this.montoSolicitado = this.oferta.montoMaximo;
    }
  }

  volverAOferta(): void {
    this.mostrarFormulario = false;
  }

  calcularPago(): void {
    if (!this.oferta || this.montoSolicitado <= 0 || this.plazoMeses <= 0) {
      return;
    }

    const Pr = this.montoSolicitado;
    const i = this.oferta.tasaMensual / 100;
    const n = this.plazoMeses;

    this.totalAPagar = Pr + (Pr * i * n);
    this.pagoMensual = this.totalAPagar / n;
    this.capacidadPago = this.ingresoMensual - this.gastosMensuales;

    const maxPago = this.capacidadPago * 0.4;
    this.aprobado = this.pagoMensual <= maxPago && this.capacidadPago > 0;
  }

  enviarSolicitud(): void {
    if (!this.aprobado) {
      alert('La solicitud no cumple con los requisitos de capacidad de pago');
      return;
    }

    const userId = this.usuario?.IdUsuario || this.usuario?.IDUsuario;
    this.cargando = true;

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
            this.cerrarModal();
          } else {
            alert('Error al enviar solicitud');
          }
        },
        error: (err) => {
          this.cargando = false;
          alert('Error al enviar solicitud');
        }
      });
  }

  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto);
  }
}