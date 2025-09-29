// src/app/home/home.ts

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule], 
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  constructor() { }

  soyEmpleadoClick() {
    console.log("Botón 'SOY EMPLEADO' fue presionado.");
  }
}