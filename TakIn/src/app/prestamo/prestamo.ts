import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule],
  templateUrl: './prestamo.html',
  styleUrl: './prestamo.css'
})
export class Prestamo {
  constructor() { }
}