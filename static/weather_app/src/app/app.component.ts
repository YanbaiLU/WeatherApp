import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {SearchFormComponent} from './search-form/search-form.component';
import {WeatherInformationComponent} from './weather-information/weather-information.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SearchFormComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.router.navigate(['result'], {queryParams: {lat: 1, lng: 2, display: false, rightInput: false}});
    // this.router.navigate([''])
  }

  title = 'weather_app';
}
