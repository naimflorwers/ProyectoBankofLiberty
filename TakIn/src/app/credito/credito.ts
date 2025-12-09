import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-credito',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
templateUrl: './credito.html',
  styleUrl: './credito.css'
})
export class Credito {
  constructor() {}
}