import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-cuenta-eliminada-gerente',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule],
  templateUrl: './cuenta-eliminada-gerente.html',
  styleUrl: './cuenta-eliminada-gerente.css'
})
export class CuentaEliminadaGerente {
  constructor() {}
}