import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './recuperar-contrasena.html',
  styleUrls: ['./recuperar-contrasena.css']
})
export class RecuperarContrasena {
  // Paso 1: Solicitar correo
  correo: string = '';
  
  // Paso 2: Verificar código
  codigoIngresado: string = '';
  
  // Paso 3: Nueva contraseña
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  
  // Control de pasos
  pasoActual: number = 1; // 1: Correo, 2: Código, 3: Nueva contraseña
  
  // Estados
  errorMsg: string = '';
  successMsg: string = '';
  procesando: boolean = false; // Prevenir doble click
  
  // Visibilidad de contraseñas
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Paso 1: Solicitar código de verificación
   */
  solicitarCodigo(): void {
    if (!this.correo) {
      this.errorMsg = 'Por favor ingresa tu correo electrónico';
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.correo)) {
      this.errorMsg = 'Por favor ingresa un correo electrónico válido';
      return;
    }

    this.errorMsg = '';
    this.successMsg = '';
    
    // Avanzar inmediatamente al siguiente paso
    this.pasoActual = 2;

    // Enviar petición en segundo plano
    this.http.post(`${this.apiUrl}/solicitar-recuperacion`, { correo: this.correo })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.successMsg = 'Código enviado a tu correo';
            setTimeout(() => this.successMsg = '', 3000);
          } else {
            this.errorMsg = response.error || 'Error al enviar el código';
            this.pasoActual = 1; // Volver si hay error
          }
        },
        error: (err) => {
          console.error('Error al solicitar código:', err);
          this.errorMsg = err.error?.error || 'El correo no está registrado o ocurrió un error';
          this.pasoActual = 1; // Volver si hay error
        }
      });
  }

  /**
   * Paso 2: Verificar código
   */
  verificarCodigo(): void {
    if (!this.codigoIngresado || this.codigoIngresado.length !== 6) {
      this.errorMsg = 'Por favor ingresa el código de 6 dígitos';
      return;
    }

    this.errorMsg = '';
    this.successMsg = '';
    
    // Avanzar inmediatamente al siguiente paso
    this.pasoActual = 3;

    // Verificar en segundo plano
    this.http.post(`${this.apiUrl}/verificar-codigo`, { 
      correo: this.correo, 
      codigo: this.codigoIngresado 
    })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.successMsg = 'Código verificado';
            setTimeout(() => this.successMsg = '', 3000);
          } else {
            this.errorMsg = response.error || 'Código incorrecto';
            this.pasoActual = 2; // Volver si hay error
          }
        },
        error: (err) => {
          console.error('Error al verificar código:', err);
          this.errorMsg = err.error?.error || 'Código incorrecto o expirado';
          this.pasoActual = 2; // Volver si hay error
        }
      });
  }

  /**
   * Paso 3: Cambiar contraseña
   */
  cambiarContrasena(): void {
    // Prevenir doble click
    if (this.procesando) {
      return;
    }

    // Validaciones
    if (!this.nuevaContrasena || !this.confirmarContrasena) {
      this.errorMsg = 'Por favor completa todos los campos';
      return;
    }

    if (this.nuevaContrasena.length < 6) {
      this.errorMsg = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.errorMsg = 'Las contraseñas no coinciden';
      return;
    }

    this.procesando = true;
    this.errorMsg = '';
    this.successMsg = '¡Contraseña cambiada exitosamente!';
    
    // Redirigir inmediatamente
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);

    // Cambiar contraseña en segundo plano
    this.http.post(`${this.apiUrl}/cambiar-contrasena`, { 
      correo: this.correo, 
      codigo: this.codigoIngresado,
      nuevaContrasena: this.nuevaContrasena 
    })
      .subscribe({
        next: (response: any) => {
          this.procesando = false;
          if (!response.success) {
            console.error('Error al cambiar contraseña:', response.error);
          }
        },
        error: (err) => {
          this.procesando = false;
          console.error('Error al cambiar contraseña:', err);
        }
      });
  }

  /**
   * Volver al paso anterior
   */
  volverPaso(): void {
    if (this.pasoActual > 1) {
      this.pasoActual--;
      this.errorMsg = '';
      this.successMsg = '';
      this.procesando = false; // Resetear el estado de procesando
    }
  }

  /**
   * Reenviar código
   */
  reenviarCodigo(): void {
    // Prevenir doble click
    if (this.procesando) {
      return;
    }

    this.codigoIngresado = '';
    this.procesando = true;
    this.errorMsg = '';
    this.successMsg = 'Reenviando código...';

    // Enviar petición sin cambiar de paso
    this.http.post(`${this.apiUrl}/solicitar-recuperacion`, { correo: this.correo })
      .subscribe({
        next: (response: any) => {
          this.procesando = false;
          if (response.success) {
            this.successMsg = 'Se ha reenviado el código a tu correo';
          } else {
            this.errorMsg = response.error || 'Error al reenviar el código';
          }
        },
        error: (err) => {
          this.procesando = false;
          console.error('Error al reenviar código:', err);
          this.errorMsg = err.error?.error || 'Error al reenviar el código';
        }
      });
  }

  /**
   * Toggle visibilidad de contraseña
   */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  /**
   * Volver al login
   */
  volverLogin(): void {
    this.router.navigate(['/login']);
  }
}
