import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-prestamo-gerente',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule],
  templateUrl: './prestamo-gerente.html',
  styleUrl: './prestamo-gerente.css'
})
export class PrestamoGerente {
  constructor() { }
}