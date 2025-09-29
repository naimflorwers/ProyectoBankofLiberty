// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ClienteGuard, EjecutivoGuard, GerenteGuard } from './guards/role.guard';
import { Home } from './home/home';
import { Login } from './login/login'; 
import { LoginE } from './login-e/login-e';
import { AbrirCuenta } from './abrir-cuenta/abrir-cuenta';
import { Solicitudes } from './solicitudes/solicitudes';
import { Prestamo } from './prestamo/prestamo';
import { MenuEjecutivo } from './menu-ejecutivo/menu-ejecutivo';
import { CrearCuenta } from './crear-cuenta/crear-cuenta';
import { CerrarCuenta } from './cerrar-cuenta/cerrar-cuenta';
import { CuentaEliminada } from './cuenta-eliminada/cuenta-eliminada';
import { CuentaCreada } from './cuenta-creada/cuenta-creada';
import { PrestamoAceptado } from './prestamo-aceptado/prestamo-aceptado';
import { Credito } from './credito/credito';
import { LoginG } from './login-g/login-g';
import { CrearCuentaGerente } from './crear-cuenta-gerente/crear-cuenta-gerente';
import { CerrarCuentaGerente } from './cerrar-cuenta-gerente/cerrar-cuenta-gerente';
import { SolicitudesGerente } from './solicitudes-gerente/solicitudes-gerente';
import { PrestamoGerente } from './prestamo-gerente/prestamo-gerente';
import { CreditoGerente } from './credito-gerente/credito-gerente';
import { MenuGerente } from './menu-gerente/menu-gerente';
import { CuentaCreadaGerente } from './cuenta-creada-gerente/cuenta-creada-gerente';
import { CuentaEliminadaGerente } from './cuenta-eliminada-gerente/cuenta-eliminada-gerente';
import { PrestamoAceptadoGerente } from './prestamo-aceptado-gerente/prestamo-aceptado-gerente';
import { AsignarRoles } from './asignar-roles/asignar-roles';
import { MenuCliente } from './menu-cliente/menu-cliente';
import { Transferencia } from './transferencia/transferencia';
import { TransferenciaDestino } from './transferencia-destino/transferencia-destino';
import { IngresarDinero } from './ingresar-dinero/ingresar-dinero';
import { RetirarDinero } from './retirar-dinero/retirar-dinero';
import { ConfirmacionIdentidad } from './confirmacion-identidad/confirmacion-identidad';
import { OperacionCompleta } from './operacion-completa/operacion-completa';
import { OperacionCompletada } from './operacion-completada/operacion-completada';
import { TransferenciaExitosa } from './transferencia-exitosa/transferencia-exitosa';
import path from 'path';


export const routes: Routes = [
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'login',
    component: Login, 
  },
  {
    path: 'abrir-cuenta',
    component: AbrirCuenta,
    canActivate: [EjecutivoGuard,GerenteGuard]
    
  },
  {
    path: 'solicitudes',
    component: Solicitudes,
    canActivate: [EjecutivoGuard,GerenteGuard]
  },
  {
    path: 'prestamo',
    component: Prestamo,
    canActivate: [EjecutivoGuard,GerenteGuard]
  },  
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'menu-ejecutivo',
    component: MenuEjecutivo,
    canActivate: [EjecutivoGuard]
  },
  {
    path: 'crear-cuenta',
    component: CrearCuenta,
    canActivate: [EjecutivoGuard,GerenteGuard]
  },
  {
    path: 'cerrar-cuenta',
    component: CerrarCuenta,
    canActivate: [EjecutivoGuard,GerenteGuard]
  },
  {
    path: 'cuenta-eliminada',
    component: CuentaEliminada,
    canActivate: [EjecutivoGuard,GerenteGuard]
  },
  {
    path: 'cuenta-creada',  
    component: CuentaCreada,
    canActivate: [EjecutivoGuard,GerenteGuard]
  },
  {
    path: 'prestamo-aceptado',
    component: PrestamoAceptado,
    canActivate: [EjecutivoGuard,GerenteGuard]
  },
  {
    path: 'credito',
    component: Credito,
    canActivate: [EjecutivoGuard,GerenteGuard]
  },
  {
    path: 'crear-cuenta-gerente',
    component: CrearCuentaGerente,
    canActivate: [GerenteGuard]
  },
  {
    path: 'cerrar-cuenta-gerente',  
    component: CerrarCuentaGerente,
    canActivate: [GerenteGuard]
  },
  {
    path: 'solicitudes-gerente',
    component: SolicitudesGerente,
    canActivate: [GerenteGuard]
  },
  {
    path: 'prestamo-gerente',
    component: PrestamoGerente,
    canActivate: [GerenteGuard]
  },
  {
    path: 'credito-gerente',
    component: CreditoGerente,
    canActivate: [GerenteGuard]
  },
  {
    path: 'menu-gerente',
    component: MenuGerente,
    canActivate: [GerenteGuard]
  },
  {
    path: 'cuenta-creada-gerente',
    component: CuentaCreadaGerente,
    canActivate: [GerenteGuard]
  },
  {
    path: 'cuenta-eliminada-gerente',
    component: CuentaEliminadaGerente,
    canActivate: [GerenteGuard]
  },
  {
    path: 'prestamo-aceptado-gerente',
    component: PrestamoAceptadoGerente,
    canActivate: [GerenteGuard]
  },
  {
    path: 'asignar-roles',
    component: AsignarRoles,
    canActivate: [EjecutivoGuard]
  },{
    path: 'menu-cliente',
    component: MenuCliente,
    canActivate: [ClienteGuard]
  },
  {
    path: 'transferencia',    
    component: Transferencia,
    canActivate: [ClienteGuard]
  },
  {
    path: 'ingresar-dinero',
    component: IngresarDinero,
    canActivate: [ClienteGuard]
  },
  {
    path: 'retirar-dinero',
    component: RetirarDinero,
    canActivate: [ClienteGuard]
  },
  {
    path: 'transferencia-destino',
    component: TransferenciaDestino,
    canActivate: [ClienteGuard]
  },
  {
    path: 'confirmacion-identidad',
    component: ConfirmacionIdentidad,
    canActivate: [ClienteGuard]
  },
  {
    path: 'operacion-completa',
    component: OperacionCompleta,
    canActivate: [ClienteGuard]
  },
  {
    path: 'operacion-completada',
    component: OperacionCompletada,
    canActivate: [ClienteGuard]
  },
  {
    path: 'transferencia-exitosa',
    component: TransferenciaExitosa,
    canActivate: [ClienteGuard]
  }
];