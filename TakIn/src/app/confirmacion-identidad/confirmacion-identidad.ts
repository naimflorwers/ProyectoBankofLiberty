import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <--- Corregido (antes decia 'express')
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirmacion-identidad',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
templateUrl: './confirmacion-identidad.html',
  styleUrl: './confirmacion-identidad.css'
})
export class ConfirmacionIdentidad {
  password: string = ''; // Variable para el input

  constructor() {}
}