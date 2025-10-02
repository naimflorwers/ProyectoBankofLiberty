import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UsuariosService } from '../../services/usuarios.service'; 
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-cliente',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule],
  providers: [UsuariosService],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  correo: string = '';
  contrasena: string = '';
  passwordVisible: boolean = false;
  errorMsg: string = '';

  constructor(private usuariosService: UsuariosService, private router: Router) {}

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
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
        
          const rol = String(res.rol).trim().toLowerCase();
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
}