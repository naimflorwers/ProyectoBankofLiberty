import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [RouterModule, CommonModule],
templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.css'
})
export class Solicitudes {
  constructor() { }
}