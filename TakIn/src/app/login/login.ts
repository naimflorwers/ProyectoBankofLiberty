import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UsuariosService } from '../../services/usuarios.service';
import { SessionService } from '../services/session.service';
import { BiometricAuthService } from '../services/biometric-auth.service';
import { IonicModule, AlertController, Platform } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-cliente',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule, IonicModule],
  providers: [UsuariosService],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  correo: string = '';
  contrasena: string = '';
  passwordVisible: boolean = false;
  errorMsg: string = '';
  biometricAvailable: boolean = false;

  constructor(
    private usuariosService: UsuariosService, 
    private router: Router, 
    private sessionService: SessionService,
    private biometricService: BiometricAuthService,
    private alertController: AlertController,
    private platform: Platform
  ) {}

  async ngOnInit() {
    // Verificar si la biometría está disponible en el dispositivo
    if (this.platform.is('capacitor')) {
      this.biometricAvailable = await this.biometricService.isAvailable();
    }
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  recuperarContrasena(event: Event) {
    event.preventDefault();
    this.router.navigate(['/recuperar-contrasena']);
  }

  login() {
    if (!this.correo || !this.contrasena) {
      this.errorMsg = 'Debes llenar todos los campos';
      return;
    }

    this.usuariosService.login(this.correo, this.contrasena).subscribe({
      next: async (res) => {
        console.log('Respuesta del backend:', res);
        if (res && res.success && res.rol && res.user) {
          try {
            localStorage.setItem('usuario', JSON.stringify(res.user));
            localStorage.setItem('rol', res.rol);
            console.log('Guardado en localStorage:', localStorage.getItem('usuario'), localStorage.getItem('rol'));
          } catch (e) {
            console.error('Error guardando en localStorage:', e);
          }
        
          // Start session timer: 30 seconds
          this.sessionService.startSession(30 * 1000);

          const rol = String(res.rol).trim().toLowerCase();
          
          // Si es cliente y la biometría está disponible, ofrecer guardar credenciales
          if (rol === 'cliente' && this.biometricAvailable && !this.biometricService.isBiometricEnabled()) {
            await this.offerBiometricSetup();
          }

          if (rol === 'cliente') {
            this.router.navigate(['/menu-cliente']);
          } else if (rol === 'ejecutivo') {
            this.router.navigate(['/menu-ejecutivo']);   
          }  else if (rol === 'gerente') {
            this.router.navigate(['/menu-gerente']);   
          } else {
            this.errorMsg = 'Rol no reconocido';
          }
        } else {
          this.errorMsg = 'Usuario o contraseña incorrectos';
        }
      },
      error: () => {
        this.errorMsg = 'Usuario o contraseña incorrectos';
      }
    });
  }

  async offerBiometricSetup() {
    const biometryType = this.biometricService.getBiometryType();
    const biometryName = this.biometricService.getBiometryTypeName(biometryType);
    
    const alert = await this.alertController.create({
      header: 'Habilitar autenticación biométrica',
      message: `¿Deseas usar ${biometryName} para iniciar sesión más rápido la próxima vez?`,
      buttons: [
        {
          text: 'No, gracias',
          role: 'cancel'
        },
        {
          text: 'Sí, habilitar',
          handler: async () => {
            const enabled = await this.biometricService.setBiometricEnabled(
              true,
              this.correo,
              this.contrasena
            );
            if (enabled) {
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: `${biometryName} habilitado correctamente. La próxima vez podrás iniciar sesión desde el botón "SOY CLIENTE" en la página principal.`,
                buttons: ['OK']
              });
              await successAlert.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }
}