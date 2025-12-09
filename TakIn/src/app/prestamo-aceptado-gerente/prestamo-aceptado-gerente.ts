import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prestamo-aceptado-gerente',
  standalone: true,
  imports: [RouterModule, CommonModule],
templateUrl: './prestamo-aceptado-gerente.html',
  styleUrl: './prestamo-aceptado-gerente.css'
})
export class PrestamoAceptadoGerente {
  constructor() {}
}