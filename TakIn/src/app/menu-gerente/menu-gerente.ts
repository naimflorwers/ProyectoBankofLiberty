import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-gerente',
  standalone: true,
  imports: [RouterModule, CommonModule],
templateUrl: './menu-gerente.html',
  styleUrl: './menu-gerente.css'
})
export class MenuGerente {
  constructor() {}
}