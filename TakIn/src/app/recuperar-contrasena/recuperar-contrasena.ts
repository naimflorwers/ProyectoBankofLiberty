import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HttpClientModule, IonicModule],
  // IMPORTANTE: Estos nombres NO tienen ñ. Asegúrate de renombrar tus archivos.
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
  procesando: boolean = false; // Tu variable correcta
  
  // Visibilidad de contraseñas
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  private apiUrl = 'http://penyrphf.icu:3000/api';

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
    this.procesando = true;

    // Enviar petición
    this.http.post(`${this.apiUrl}/solicitar-recuperacion`, { correo: this.correo })
      .subscribe({
        next: (response: any) => {
          this.procesando = false;
          // Asumimos que tu backend devuelve { success: true }
          if (response.success || response.message) { // Ajusta según tu respuesta real
            this.pasoActual = 2; 
            this.successMsg = 'Código enviado a tu correo';
            setTimeout(() => this.successMsg = '', 3000);
          } else {
            this.errorMsg = response.error || 'Error al enviar el código';
          }
        },
        error: (err) => {
          this.procesando = false;
          console.error('Error al solicitar código:', err);
          // Si no tienes backend corriendo, descomenta la siguiente línea para probar visualmente:
          // this.pasoActual = 2; 
          this.errorMsg = err.error?.error || 'El correo no está registrado o no hay conexión con el servidor';
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
    this.procesando = true;

    this.http.post(`${this.apiUrl}/verificar-codigo`, { 
      correo: this.correo, 
      codigo: this.codigoIngresado 
    })
      .subscribe({
        next: (response: any) => {
          this.procesando = false;
          if (response.success || response.message) {
            this.pasoActual = 3;
            this.successMsg = 'Código verificado';
            setTimeout(() => this.successMsg = '', 3000);
          } else {
            this.errorMsg = response.error || 'Código incorrecto';
          }
        },
        error: (err) => {
          this.procesando = false;
          console.error('Error al verificar código:', err);
          // Si no tienes backend corriendo, descomenta para probar:
          // this.pasoActual = 3;
          this.errorMsg = err.error?.error || 'Código incorrecto o expirado';
        }
      });
  }

  /**
   * Paso 3: Cambiar contraseña
   */
  cambiarContrasena(): void {
    if (this.procesando) return;

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

    this.http.post(`${this.apiUrl}/cambiar-contrasena`, { 
      correo: this.correo, 
      codigo: this.codigoIngresado,
      nuevaContrasena: this.nuevaContrasena 
    })
      .subscribe({
        next: (response: any) => {
          this.procesando = false;
          if (response.success || response.message) {
            this.successMsg = '¡Contraseña cambiada exitosamente!';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1500);
          } else {
             this.errorMsg = response.error || 'Error al cambiar contraseña';
          }
        },
        error: (err) => {
          this.procesando = false;
          console.error('Error al cambiar contraseña:', err);
          // Si no tienes backend, descomenta:
          // this.router.navigate(['/login']);
          this.errorMsg = err.error?.error || 'Error al procesar la solicitud';
        }
      });
  }

  volverPaso(): void {
    if (this.pasoActual > 1) {
      this.pasoActual--;
      this.errorMsg = '';
      this.successMsg = '';
      this.procesando = false;
    }
  }

  reenviarCodigo(): void {
    if (this.procesando) return;

    this.codigoIngresado = '';
    this.procesando = true;
    this.errorMsg = '';
    this.successMsg = 'Reenviando código...';

    this.http.post(`${this.apiUrl}/solicitar-recuperacion`, { correo: this.correo })
      .subscribe({
        next: (response: any) => {
          this.procesando = false;
          if (response.success || response.message) {
            this.successMsg = 'Se ha reenviado el código a tu correo';
          } else {
            this.errorMsg = response.error || 'Error al reenviar el código';
          }
        },
        error: (err) => {
          this.procesando = false;
          console.error('Error al reenviar código:', err);
          this.errorMsg = err.error?.error || 'Error de conexión';
        }
      });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  volverLogin(): void {
    this.router.navigate(['/login']);
  }
}