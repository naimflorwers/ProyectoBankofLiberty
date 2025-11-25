import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-ingresar-dinero',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule],
  templateUrl: './ingresar-dinero.html',
  styleUrl: './ingresar-dinero.css'
})
export class IngresarDinero {
  constructor() {}
}