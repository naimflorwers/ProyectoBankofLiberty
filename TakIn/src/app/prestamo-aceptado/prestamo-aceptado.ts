import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-prestamo-aceptado',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule],
  templateUrl: './prestamo-aceptado.html',
  styleUrl: './prestamo-aceptado.css'
})
export class PrestamoAceptado {
  constructor() {}
}