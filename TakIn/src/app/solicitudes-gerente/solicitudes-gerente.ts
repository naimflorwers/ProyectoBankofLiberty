import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitudes-gerente',
  standalone: true,
  imports: [RouterModule, CommonModule],
templateUrl: './solicitudes-gerente.html',
  styleUrl: './solicitudes-gerente.css'
})
export class SolicitudesGerente {
  constructor() { }
}