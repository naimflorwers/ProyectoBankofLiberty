import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-ejecutivo',
  standalone: true,
  imports: [RouterModule, CommonModule],
templateUrl: './menu-ejecutivo.html',
  styleUrl: './menu-ejecutivo.css'
})
export class MenuEjecutivo {
  constructor() {}
}