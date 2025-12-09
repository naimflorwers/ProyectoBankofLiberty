import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cuenta-eliminada-gerente',
  standalone: true,
  imports: [RouterModule, CommonModule],
templateUrl: './cuenta-eliminada-gerente.html',
  styleUrl: './cuenta-eliminada-gerente.css'
})
export class CuentaEliminadaGerente {
  constructor() {}
}