import { Component } from '@angular/core';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [IonButton, IonContent, IonIcon, RouterLink],
  templateUrl: './notfound.html',
  styleUrls: ['./notfound.css']
})
export class NotFound {}
