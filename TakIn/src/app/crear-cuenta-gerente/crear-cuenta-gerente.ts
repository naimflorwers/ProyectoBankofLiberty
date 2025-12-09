import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-cuenta-gerente',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
templateUrl: './crear-cuenta-gerente.html',
  styleUrl: './crear-cuenta-gerente.css'
})
export class CrearCuentaGerente {
  constructor() {}
}