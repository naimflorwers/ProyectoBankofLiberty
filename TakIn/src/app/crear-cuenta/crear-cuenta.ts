import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-crear-cuenta',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, IonicModule],
  templateUrl: './crear-cuenta.html',
  styleUrl: './crear-cuenta.css'
})
export class CrearCuenta {
  constructor() {}
}