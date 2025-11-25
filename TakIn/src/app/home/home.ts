// src/app/home/home.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, IonicModule, CommonModule], 
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  constructor() { }

  soyEmpleadoClick() {
    console.log("Botón 'SOY EMPLEADO' fue presionado.");
  }
}