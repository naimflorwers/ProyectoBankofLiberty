import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-cuenta-creada-gerente',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule],
  templateUrl: './cuenta-creada-gerente.html',
  styleUrl: './cuenta-creada-gerente.css'
})
export class CuentaCreadaGerente {
  constructor() {}
}