import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-operacion-completa',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule],
  templateUrl: './operacion-completa.html',
  styleUrl: './operacion-completa.css'
})
export class OperacionCompleta {
  constructor() {}
}