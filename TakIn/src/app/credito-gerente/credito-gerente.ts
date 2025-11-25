import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-credito-gerente',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule, FormsModule],
  templateUrl: './credito-gerente.html',
  styleUrl: './credito-gerente.css'
})
export class CreditoGerente {
  constructor() {}
}