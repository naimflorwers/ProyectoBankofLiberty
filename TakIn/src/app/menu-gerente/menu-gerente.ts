import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-menu-gerente',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule],
  templateUrl: './menu-gerente.html',
  styleUrl: './menu-gerente.css'
})
export class MenuGerente {
  constructor() {}
}