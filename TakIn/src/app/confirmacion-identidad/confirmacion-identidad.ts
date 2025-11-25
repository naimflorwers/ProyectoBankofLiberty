import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <--- Corregido (antes decia 'express')
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-confirmacion-identidad',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, IonicModule],
  templateUrl: './confirmacion-identidad.html',
  styleUrl: './confirmacion-identidad.css'
})
export class ConfirmacionIdentidad {
  password: string = ''; // Variable para el input

  constructor() {}
}