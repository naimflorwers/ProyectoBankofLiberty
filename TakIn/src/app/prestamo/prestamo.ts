import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [RouterModule, CommonModule],
templateUrl: './prestamo.html',
  styleUrl: './prestamo.css'
})
export class Prestamo {
  constructor() { }
}