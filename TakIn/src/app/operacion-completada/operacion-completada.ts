import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-operacion-completada',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule],
  templateUrl: './operacion-completada.html',
  styleUrl: './operacion-completada.css'
})
export class OperacionCompletada {
  constructor() {}
}