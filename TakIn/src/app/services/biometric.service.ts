import { Injectable, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BiometricService {
  private biometricAvailable$ = new BehaviorSubject<boolean>(false);
  private biometricType$ = new BehaviorSubject<string>('');
  private isBiometricEnabled$ = new BehaviorSubject<boolean>(false);

  constructor(
    private fingerprintAIO: FingerprintAIO,
    private platform: Platform,
    private ngZone: NgZone
  ) {
    this.initializeBiometric();
  }

  /**
   * Initialize biometric authentication on app startup
   */
  private initializeBiometric(): void {
    this.platform.ready().then(() => {
      this.checkBiometricAvailability();
      this.loadBiometricPreference();
    });
  }

  /**
   * Check if device supports biometric authentication
   */
  private checkBiometricAvailability(): void {
    this.fingerprintAIO
      .isAvailable()
      .then((result: string) => {
        this.ngZone.run(() => {
          this.biometricAvailable$.next(true);
          this.biometricType$.next(result);
          console.log('Biometric available:', result);
        });
      })
      .catch((error) => {
        this.ngZone.run(() => {
          this.biometricAvailable$.next(false);
          console.log('Biometric not available:', error);
        });
      });
  }

  /**
   * Authenticate user with biometric
   * @param reason - Message to show on biometric dialog
   * @returns Promise<boolean> - true if authentication successful
   */
  public authenticate(reason: string = 'Autentica con biometría'): Promise<boolean> {
    return this.fingerprintAIO
      .show({
        description: reason,
        fallbackButtonTitle: 'Usar otra opción'
      } as any)
      .then(() => {
        console.log('Biometric authentication successful');
        return true;
      })
      .catch((error) => {
        console.error('Biometric authentication failed:', error);
        return false;
      });
  }

  /**
   * Enable biometric authentication for this user
   */
  public enableBiometric(userId: string): void {
    try {
      const biometricData = {
        userId: userId,
        enabled: true,
        enabledAt: new Date().toISOString()
      };
      localStorage.setItem(`biometric_${userId}`, JSON.stringify(biometricData));
      this.isBiometricEnabled$.next(true);
      console.log('Biometric authentication enabled for user:', userId);
    } catch (error) {
      console.error('Error enabling biometric:', error);
    }
  }

  /**
   * Disable biometric authentication for this user
   */
  public disableBiometric(userId: string): void {
    try {
      localStorage.removeItem(`biometric_${userId}`);
      this.isBiometricEnabled$.next(false);
      console.log('Biometric authentication disabled for user:', userId);
    } catch (error) {
      console.error('Error disabling biometric:', error);
    }
  }

  /**
   * Check if biometric is enabled for a specific user
   */
  public isBiometricEnabledForUser(userId: string): boolean {
    try {
      const data = localStorage.getItem(`biometric_${userId}`);
      return data ? JSON.parse(data).enabled : false;
    } catch (error) {
      console.error('Error checking biometric status:', error);
      return false;
    }
  }

  /**
   * Load biometric preference from storage
   */
  private loadBiometricPreference(): void {
    const currentUser = localStorage.getItem('usuario');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        const isEnabled = this.isBiometricEnabledForUser(user.id || user.usuario_id);
        this.isBiometricEnabled$.next(isEnabled);
      } catch (error) {
        console.error('Error loading biometric preference:', error);
      }
    }
  }

  /**
   * Get biometric availability observable
   */
  getBiometricAvailable(): Observable<boolean> {
    return this.biometricAvailable$.asObservable();
  }

  /**
   * Get biometric type observable (e.g., 'fingerprint', 'face')
   */
  getBiometricType(): Observable<string> {
    return this.biometricType$.asObservable();
  }

  /**
   * Get biometric enabled status observable
   */
  getIsBiometricEnabled(): Observable<boolean> {
    return this.isBiometricEnabled$.asObservable();
  }
}
