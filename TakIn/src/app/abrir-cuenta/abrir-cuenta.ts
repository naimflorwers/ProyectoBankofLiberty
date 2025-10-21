import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-abrir-cuenta',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './abrir-cuenta.html',
  styleUrl: './abrir-cuenta.css'
})
export class AbrirCuenta {
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  correo: string = '';
  curp: string = '';
  contrasena: string = '';
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private http: HttpClient, private router: Router) { }

  register() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.nombre || !this.apellidoPaterno || !this.apellidoMaterno || !this.correo || !this.contrasena) {
      this.errorMsg = 'Por favor completa todos los campos obligatorios.';
      return;
    }

    const payload = {
      nombre: this.nombre,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      correo: this.correo,
      curp: this.curp,
      contrasena: this.contrasena,
      rol: 'cliente'
    };

    this.loading = true;
    this.http.post('http://localhost:3000/api/registro', payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMsg = 'Cuenta creada correctamente. Redirigiendo a iniciar sesión...';
        setTimeout(() => this.router.navigate(['/login']), 800);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error al crear la cuenta';
      }
    });
  }
}
