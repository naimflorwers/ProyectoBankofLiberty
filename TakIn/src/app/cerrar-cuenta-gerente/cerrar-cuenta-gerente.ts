import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-cerrar-cuenta-gerente',
  standalone: true,
  imports: [RouterModule, IonicModule, CommonModule, FormsModule],
  templateUrl: './cerrar-cuenta-gerente.html',
  styleUrl: './cerrar-cuenta-gerente.css'
})
export class CerrarCuentaGerente {
  // Variables necesarias para el ngModel del HTML
  nombre: string = '';
  cuenta: string = '';

  constructor() {}
}