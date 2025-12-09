// src/app/home/home.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  menuOpen = false;
  dropdownOpen = false;

  constructor() { }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  soyEmpleadoClick() {
    console.log("Botón 'SOY EMPLEADO' fue presionado.");
  }
}