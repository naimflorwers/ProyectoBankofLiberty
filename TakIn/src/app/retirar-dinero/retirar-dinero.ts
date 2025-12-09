import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retirar-dinero',
  standalone: true,
  imports: [RouterModule, CommonModule],
templateUrl: './retirar-dinero.html',
  styleUrl: './retirar-dinero.css'
})
export class RetirarDinero {
  constructor() {}
}