import {Component} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {AppComponent} from '../app.component';
import { RouterOutlet } from '@angular/router';
import {animate, group, query, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-weather-information',
  standalone: true,
  imports: [
    NgbModule,
    RouterModule,
    AppComponent,
    RouterOutlet,
  ],
  templateUrl: './weather-information.component.html',
  styleUrl: './weather-information.component.css',
  animations: [
    trigger('routeAnimations', [
      transition('HomePage => AboutPage', [
        style({ transform: 'translateX(-100%)' }),
        animate('500ms ease-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition('AboutPage => HomePage', [
        style({ transform: 'translateX(100%)' }),
        animate('500ms ease-out', style({ transform: 'translateX(0%)' }))
      ])
    ])
  ]
})
export class WeatherInformationComponent {
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
