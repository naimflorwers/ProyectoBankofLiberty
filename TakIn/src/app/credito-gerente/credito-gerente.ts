import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-credito-gerente',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
templateUrl: './credito-gerente.html',
  styleUrl: './credito-gerente.css'
})
export class CreditoGerente {
  constructor() {}
}