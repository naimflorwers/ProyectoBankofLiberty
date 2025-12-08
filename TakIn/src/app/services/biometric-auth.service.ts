import { Injectable } from '@angular/core';
import { NativeBiometric, BiometryType } from 'capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class BiometricAuthService {
  private biometryType: BiometryType = BiometryType.NONE;

  constructor() {}

  /**
   * Verifica si el dispositivo soporta autenticación biométrica
   */
  async isAvailable(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return false;
    }

    try {
      const result = await NativeBiometric.isAvailable();
      if (result.isAvailable) {
        this.biometryType = result.biometryType;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking biometry:', error);
      return false;
    }
  }

  /**
   * Obtiene el tipo de biometría disponible
   */
  getBiometryType(): BiometryType {
    return this.biometryType;
  }

  /**
   * Obtiene el nombre legible del tipo de biometría
   */
  getBiometryTypeName(type: BiometryType): string {
    switch (type) {
      case BiometryType.FINGERPRINT:
        return 'Huella Digital';
      case BiometryType.FACE_AUTHENTICATION:
        return 'Reconocimiento Facial';
      case BiometryType.IRIS_AUTHENTICATION:
        return 'Reconocimiento de Iris';
      default:
        return 'Biometría';
    }
  }

  /**
   * Solicita autenticación biométrica
   */
  async authenticate(reason: string = 'Autenticarse para continuar'): Promise<boolean> {
    try {
      await NativeBiometric.verifyIdentity({
        reason,
        title: 'Bank of Liberty',
        subtitle: 'Verificación de identidad',
        description: reason,
      });
      return true;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  }

  /**
   * Guarda las credenciales del usuario de forma segura
   */
  async saveCredentials(email: string, password: string): Promise<boolean> {
    try {
      // Guardar credenciales de forma segura usando el almacenamiento nativo
      await NativeBiometric.setCredentials({
        username: email,
        password: password,
        server: 'com.bankofliberty.takin'
      });
      localStorage.setItem('biometric_enabled', 'true');
      localStorage.setItem('biometric_email', email);
      return true;
    } catch (error) {
      console.error('Error saving credentials:', error);
      return false;
    }
  }

  /**
   * Obtiene las credenciales guardadas
   */
  async getCredentials(): Promise<{ email: string; password: string } | null> {
    try {
      const credentials = await NativeBiometric.getCredentials({
        server: 'com.bankofliberty.takin'
      });
      
      if (credentials.username && credentials.password) {
        return {
          email: credentials.username,
          password: credentials.password
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting credentials:', error);
      return null;
    }
  }

  /**
   * Verifica si la autenticación biométrica está habilitada
   */
  isBiometricEnabled(): boolean {
    return localStorage.getItem('biometric_enabled') === 'true';
  }

  /**
   * Obtiene el email asociado a la biometría
   */
  getBiometricEmail(): string | null {
    return localStorage.getItem('biometric_email');
  }

  /**
   * Habilita o deshabilita la autenticación biométrica
   */
  async setBiometricEnabled(enabled: boolean, email?: string, password?: string): Promise<boolean> {
    if (enabled && email && password) {
      return await this.saveCredentials(email, password);
    } else if (!enabled) {
      try {
        await NativeBiometric.deleteCredentials({
          server: 'com.bankofliberty.takin'
        });
        localStorage.removeItem('biometric_email');
        localStorage.removeItem('biometric_enabled');
        return true;
      } catch (error) {
        console.error('Error deleting credentials:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Limpia todos los datos biométricos
   */
  async clearBiometricData(): Promise<void> {
    try {
      await NativeBiometric.deleteCredentials({
        server: 'com.bankofliberty.takin'
      });
      localStorage.removeItem('biometric_email');
      localStorage.removeItem('biometric_enabled');
    } catch (error) {
      console.error('Error clearing biometric data:', error);
    }
  }
}
