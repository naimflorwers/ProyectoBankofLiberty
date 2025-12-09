import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prestamo-gerente',
  standalone: true,
  imports: [RouterModule, CommonModule],
templateUrl: './prestamo-gerente.html',
  styleUrl: './prestamo-gerente.css'
})
export class PrestamoGerente {
  constructor() { }
}