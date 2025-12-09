import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-operacion-completa',
  standalone: true,
  imports: [RouterModule, CommonModule],
templateUrl: './operacion-completa.html',
  styleUrl: './operacion-completa.css'
})
export class OperacionCompleta {
  constructor() {}
}