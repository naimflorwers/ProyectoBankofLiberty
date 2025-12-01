import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UsuariosService } from '../../services/usuarios.service';
import { SessionService } from '../services/session.service';
import { BiometricService } from '../services/biometric.service';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login-cliente',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule, IonicModule],
  providers: [UsuariosService],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit, OnDestroy {
  correo: string = '';
  contrasena: string = '';
  passwordVisible: boolean = false;
  errorMsg: string = '';
  biometricAvailable: boolean = false;
  biometricType: string = '';
  isBiometricEnabled: boolean = false;
  showBiometricOption: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private sessionService: SessionService,
    private biometricService: BiometricService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.initializeBiometric();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize biometric detection
   */
  private initializeBiometric(): void {
    this.biometricService
      .getBiometricAvailable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((available) => {
        this.biometricAvailable = available;
      });

    this.biometricService
      .getBiometricType()
      .pipe(takeUntil(this.destroy$))
      .subscribe((type) => {
        this.biometricType = type;
      });
  }

  /**
   * Authenticate with biometric
   */
  async authenticateWithBiometric(): Promise<void> {
    const success = await this.biometricService.authenticate('Autentica con huella digital');
    if (success) {
      this.showToast('Autenticación biométrica exitosa', 'success');
      // Redirect to appropriate menu based on user role
      this.navigateToMenu();
    } else {
      this.showToast('Autenticación biométrica fallida', 'danger');
    }
  }

  /**
   * Show toast message
   */
  private async showToast(message: string, color: string = 'primary'): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }

  /**
   * Show dialog to enable biometric
   */
  private async showEnableBiometricDialog(userId: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Autenticación Biométrica',
      message: `¿Deseas habilitar la autenticación biométrica (${this.biometricType}) para futuros inicios de sesión?`,
      buttons: [
        {
          text: 'No, después',
          role: 'cancel',
          handler: () => {
            console.log('Biometric not enabled');
          }
        },
        {
          text: 'Sí, habilitar',
          handler: () => {
            this.biometricService.enableBiometric(userId);
            this.showToast('Autenticación biométrica habilitada', 'success');
          }
        }
      ]
    });
    await alert.present();
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
      next: (res) => {
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

          // Check if biometric is available and offer to enable
          if (this.biometricAvailable && res.user) {
            const userId = res.user.id || res.user.usuario_id;
            if (!this.biometricService.isBiometricEnabledForUser(userId)) {
              this.showEnableBiometricDialog(userId);
            }
          }

          const rol = String(res.rol).trim().toLowerCase();
          this.navigateToMenu();
        } else {
          this.errorMsg = 'Usuario o contraseña incorrectos';
        }
      },
      error: () => {
        this.errorMsg = 'Usuario o contraseña incorrectos';
      }
    });
  }

  /**
   * Navigate to menu based on user role
   */
  private navigateToMenu(): void {
    const rol = localStorage.getItem('rol');
    if (rol) {
      const rolLower = String(rol).trim().toLowerCase();
      if (rolLower === 'cliente') {
        this.router.navigate(['/menu-cliente']);
      } else if (rolLower === 'ejecutivo') {
        this.router.navigate(['/menu-ejecutivo']);
      } else if (rolLower === 'gerente') {
        this.router.navigate(['/menu-gerente']);
      } else {
        this.errorMsg = 'Rol no reconocido';
      }
    }
  }
}