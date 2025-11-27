import { Component } from '@angular/core';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [IonButton, IonContent, IonIcon, RouterLink],
  templateUrl: './server-error.html',
  styleUrl: './server-error.css'
})
export class ServerError {}
