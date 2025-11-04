import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Movimiento {
  fecha: string;
  tipo: string;
  descripcion: string;
  referencia: string;
  monto: number;
  saldo: number;
}

interface EstadoCuentaData {
  periodo: {
    inicio: string;
    fin: string;
  };
  cuenta: {
    numero: string;
    titular: string;
    tipo: string;
  };
  saldos: {
    inicial: number;
    ingresos: number;
    egresos: number;
    final: number;
  };
  movimientos: Movimiento[];
}

@Component({
  selector: 'app-estado-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './estado-cuenta.html',
  styleUrls: ['./estado-cuenta.css']
})
export class EstadoCuenta implements OnInit {
  // Filtros
  fechaInicio: string = '';
  fechaFin: string = '';
  tipoMovimiento: string = 'todos'; // todos, ingresos, egresos
  
  // Datos del estado de cuenta
  estadoCuenta: EstadoCuentaData | null = null;
  movimientosFiltrados: Movimiento[] = [];
  
  // Estados
  cargando: boolean = false;
  errorMsg: string = '';
  
  // Usuario actual
  usuario: any = null;
  
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener usuario del localStorage
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      try {
        this.usuario = JSON.parse(usuarioStr);
        console.log('Usuario cargado:', this.usuario);
        
        // Verificar que tenga IdUsuario o IDUsuario
        const userId = this.usuario.IdUsuario || this.usuario.IDUsuario;
        if (!userId) {
          console.error('El usuario no tiene IdUsuario ni IDUsuario:', this.usuario);
          this.errorMsg = 'Error: Usuario sin ID. Por favor vuelve a iniciar sesión.';
          return;
        }
        
        // Establecer fechas por defecto (último mes)
        const hoy = new Date();
        const haceUnMes = new Date();
        haceUnMes.setMonth(haceUnMes.getMonth() - 1);
        
        this.fechaFin = this.formatearFecha(hoy);
        this.fechaInicio = this.formatearFecha(haceUnMes);
        
        // Cargar automáticamente al inicio
        this.cargarEstadoCuenta();
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        this.errorMsg = 'Error al cargar datos del usuario';
        this.router.navigate(['/login']);
      }
    } else {
      console.error('No hay usuario en localStorage');
      this.router.navigate(['/login']);
    }
  }

  /**
   * Cargar estado de cuenta desde el backend
   */
  cargarEstadoCuenta(): void {
    // Manejar ambos casos: IdUsuario o IDUsuario
    const userId = this.usuario?.IdUsuario || this.usuario?.IDUsuario;
    
    if (!this.usuario || !userId) {
      this.errorMsg = 'No se pudo identificar el usuario';
      console.error('Usuario sin ID:', this.usuario);
      return;
    }

    this.cargando = true;
    this.errorMsg = '';

    const params = {
      idUsuario: userId,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    };

    this.http.post<any>(`${this.apiUrl}/estado-cuenta`, params)
      .subscribe({
        next: (response) => {
          this.cargando = false;
          if (response.success) {
            this.estadoCuenta = response.data;
            this.aplicarFiltros();
          } else {
            this.errorMsg = response.error || 'Error al cargar el estado de cuenta';
          }
        },
        error: (err) => {
          this.cargando = false;
          console.error('Error al cargar estado de cuenta:', err);
          this.errorMsg = err.error?.error || 'Error al cargar el estado de cuenta';
        }
      });
  }

  /**
   * Aplicar filtros a los movimientos
   */
  aplicarFiltros(): void {
    if (!this.estadoCuenta) {
      this.movimientosFiltrados = [];
      return;
    }

    let movimientos = [...this.estadoCuenta.movimientos];

    // Filtrar por tipo de movimiento
    if (this.tipoMovimiento !== 'todos') {
      movimientos = movimientos.filter(mov => {
        if (this.tipoMovimiento === 'ingresos') {
          return mov.monto > 0;
        } else if (this.tipoMovimiento === 'egresos') {
          return mov.monto < 0;
        }
        return true;
      });
    }

    this.movimientosFiltrados = movimientos;
  }

  /**
   * Buscar con nuevos filtros
   */
  buscar(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      this.errorMsg = 'Por favor selecciona ambas fechas';
      return;
    }

    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);

    if (inicio > fin) {
      this.errorMsg = 'La fecha de inicio debe ser menor a la fecha fin';
      return;
    }

    this.cargarEstadoCuenta();
  }

  /**
   * Descargar estado de cuenta en PDF
   */
  descargarPDF(): void {
    if (!this.estadoCuenta) {
      return;
    }

    // Manejar ambos casos: IdUsuario o IDUsuario
    const userId = this.usuario?.IdUsuario || this.usuario?.IDUsuario;

    this.cargando = true;

    const params = {
      idUsuario: userId,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    };

    this.http.post(`${this.apiUrl}/estado-cuenta/pdf`, params, { 
      responseType: 'blob' 
    })
      .subscribe({
        next: (blob) => {
          this.cargando = false;
          
          // Crear URL del blob y descargar
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `estado-cuenta-${this.fechaInicio}-${this.fechaFin}.pdf`;
          link.click();
          
          // Limpiar
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          this.cargando = false;
          console.error('Error al descargar PDF:', err);
          this.errorMsg = 'Error al generar el PDF';
        }
      });
  }

  /**
   * Formatear fecha para input type="date"
   */
  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Formatear fecha para mostrar
   */
  formatearFechaDisplay(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  /**
   * Formatear moneda
   */
  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(Math.abs(monto));
  }

  /**
   * Obtener clase CSS según el tipo de movimiento
   */
  obtenerClaseMovimiento(monto: number): string {
    return monto >= 0 ? 'ingreso' : 'egreso';
  }

  /**
   * Volver al menú
   */
  volver(): void {
    this.router.navigate(['/menu-cliente']);
  }
}
