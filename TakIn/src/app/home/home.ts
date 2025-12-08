// src/app/home/home.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 
import { IonicModule, AlertController, Platform } from '@ionic/angular';
import { BiometricAuthService } from '../services/biometric-auth.service';
import { UsuariosService } from '../../services/usuarios.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, IonicModule, CommonModule], 
  providers: [UsuariosService],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  biometricAvailable: boolean = false;
  biometricEnabled: boolean = false;

  constructor(
    private router: Router,
    private biometricService: BiometricAuthService,
    private usuariosService: UsuariosService,
    private sessionService: SessionService,
    private alertController: AlertController,
    private platform: Platform
  ) { }

  async ngOnInit() {
    // Verificar si la biometría está disponible en el dispositivo
    if (this.platform.is('capacitor')) {
      this.biometricAvailable = await this.biometricService.isAvailable();
      this.biometricEnabled = this.biometricService.isBiometricEnabled();
    }
  }

  async soyClienteClick() {
    // MODO PRUEBA: Pedir biometría directamente para probar funcionalidad
    if (this.biometricAvailable) {
      const success = await this.testBiometric();
      if (success) {
        // Biometría exitosa, ir al login
        this.router.navigate(['/login']);
      }
    } else {
      // No hay biometría disponible, ir directo al login
      this.router.navigate(['/login']);
    }
  }

  async loginWithBiometric(): Promise<boolean> {
    try {
      const biometryType = this.biometricService.getBiometryType();
      const biometryName = this.biometricService.getBiometryTypeName(biometryType);
      
      const authenticated = await this.biometricService.authenticate(
        `Usa tu ${biometryName} para acceder a Bank of Liberty`
      );

      if (authenticated) {
        const credentials = await this.biometricService.getCredentials();
        if (credentials) {
          // Validar credenciales con el backend
          return new Promise((resolve) => {
            this.usuariosService.login(credentials.email, credentials.password).subscribe({
              next: (res) => {
                if (res && res.success && res.rol && res.user) {
                  try {
                    localStorage.setItem('usuario', JSON.stringify(res.user));
                    localStorage.setItem('rol', res.rol);
                    this.sessionService.startSession(30 * 1000);
                    
                    const rol = String(res.rol).trim().toLowerCase();
                    if (rol === 'cliente') {
                      this.router.navigate(['/menu-cliente']);
                      resolve(true);
                    } else {
                      resolve(false);
                    }
                  } catch (e) {
                    console.error('Error guardando en localStorage:', e);
                    resolve(false);
                  }
                } else {
                  resolve(false);
                }
              },
              error: () => {
                resolve(false);
              }
            });
          });
        }
      }
    } catch (error) {
      console.error('Error en autenticación biométrica:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo autenticar con biometría. Por favor, usa tu contraseña.',
        buttons: ['OK']
      });
      await alert.present();
    }
    return false;
  }

  // Método de prueba para probar la funcionalidad biométrica
  private async testBiometric(): Promise<boolean> {
    try {
      // Primero verificamos qué tipo de biometría está disponible
      const available = await this.biometricService.isAvailable();
      if (!available) {
        const alert = await this.alertController.create({
          header: 'No disponible',
          message: 'La biometría no está disponible en este dispositivo',
          buttons: ['OK']
        });
        await alert.present();
        return false;
      }

      const biometryType = this.biometricService.getBiometryTypeName(
        this.biometricService.getBiometryType()
      );
      const result = await this.biometricService.authenticate(
        `Prueba de ${biometryType}`
      );
      
      if (result) {
        const alert = await this.alertController.create({
          header: '¡Éxito!',
          message: `${biometryType} verificada correctamente`,
          buttons: ['OK']
        });
        await alert.present();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en prueba biométrica:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo verificar la biometría',
        buttons: ['OK']
      });
      await alert.present();
      return false;
    }
  }

  soyEmpleadoClick() {
    console.log("Botón 'SOY EMPLEADO' fue presionado.");
  }
}