import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-menu-ejecutivo',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule],
  templateUrl: './menu-ejecutivo.html',
  styleUrl: './menu-ejecutivo.css'
})
export class MenuEjecutivo {
  constructor() {}
}