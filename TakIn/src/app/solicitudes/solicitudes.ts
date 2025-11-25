import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.css'
})
export class Solicitudes {
  constructor() { }
}