import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cuenta-eliminada',
  standalone: true,
  imports: [RouterModule, CommonModule],
templateUrl: './cuenta-eliminada.html',
  styleUrl: './cuenta-eliminada.css'
})
export class CuentaEliminada {
  constructor() {}
}