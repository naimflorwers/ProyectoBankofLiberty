import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-cuenta-creada',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule],
  templateUrl: './cuenta-creada.html',
  styleUrl: './cuenta-creada.css'
})
export class CuentaCreada {
  constructor() {}
}