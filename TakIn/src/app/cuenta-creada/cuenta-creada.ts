import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cuenta-creada',
  standalone: true,
  imports: [RouterModule, CommonModule],
templateUrl: './cuenta-creada.html',
  styleUrl: './cuenta-creada.css'
})
export class CuentaCreada {
  constructor() {}
}