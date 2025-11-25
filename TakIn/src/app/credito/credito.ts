import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-credito',
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule, FormsModule],
  templateUrl: './credito.html',
  styleUrl: './credito.css'
})
export class Credito {
  constructor() {}
}