import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-retirar-dinero',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule],
  templateUrl: './retirar-dinero.html',
  styleUrl: './retirar-dinero.css'
})
export class RetirarDinero {
  constructor() {}
}