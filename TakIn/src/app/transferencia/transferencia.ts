import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TransferenciasService, Cuenta } from '../../services/transferencias.service';

@Component({
  selector: 'app-transferencia',
  imports: [RouterModule, CommonModule],
  templateUrl: './transferencia.html',
  styleUrl: './transferencia.css'
})
export class Transferencia implements OnInit {
  cuentas: Cuenta[] = [];
  cuentaSeleccionada: Cuenta | null = null;
  idUsuario: number = 0;
  cargando: boolean = false;
  error: string = '';

  constructor(
    private transferenciasService: TransferenciasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el usuario del localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      this.idUsuario = usuario.IDUsuario;
      console.log('ID Usuario logueado:', this.idUsuario);
      this.cargarCuentas();
    } else {
      this.error = 'No hay usuario logueado';
      alert('Por favor inicia sesión primero');
      this.router.navigate(['/login']);
    }
  }

  cargarCuentas(): void {
    this.cargando = true;
    this.error = '';
    
    console.log('Cargando cuentas para usuario:', this.idUsuario);
    this.transferenciasService.getCuentasCliente(this.idUsuario).subscribe({
      next: (cuentas) => {
        console.log('Cuentas recibidas:', cuentas);
        this.cuentas = cuentas;
        this.cargando = false;
        
        if (cuentas.length === 0) {
          console.warn('No se encontraron cuentas para este usuario');
          this.error = 'No tienes cuentas disponibles';
        }
      },
      error: (err) => {
        console.error('Error al cargar cuentas:', err);
        this.error = 'No se pudieron cargar las cuentas';
        this.cargando = false;
      }
    });
  }

  seleccionarCuenta(cuenta: Cuenta): void {
    this.cuentaSeleccionada = cuenta;
  }

  continuar(): void {
    if (!this.cuentaSeleccionada) {
      alert('Por favor selecciona una cuenta');
      return;
    }

    // Guardar la cuenta seleccionada en sessionStorage para usarla en el siguiente paso
    sessionStorage.setItem('cuentaRemitente', JSON.stringify(this.cuentaSeleccionada));
    this.router.navigate(['/transferencia-destino']);
  }
}
