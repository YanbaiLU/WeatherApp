import {Component, OnInit} from '@angular/core';
import {ProgressBarComponent} from '../progress-bar/progress-bar.component';
import {RouterModule, Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';
import {interval} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {AddressService} from '../address.service';
import {WeatherInfo, WeatherResults} from '../app.interface';


@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    ProgressBarComponent,
    RouterModule,
    CommonModule
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {
  data: any;
  city: string | null = '';
  state: string | null = '';
  isVisible: boolean = true;
  isCorrect: boolean = true;
  lat: string | null = '';
  lng: string | null = '';

  weatherInfo0: WeatherInfo = {
    date: "",
    status: "",
    imgPath: "",
    tempHigh: "",
    tempLow: "",
    windSpeed: "",
    tempApp: "",
    sunRise: "",
    sunSet: "",
    humidity: "",
    visibility: "",
    cloudCover: "",
  };
  weatherInfoList: WeatherInfo[] = [this.weatherInfo0];

  constructor(private router: Router, private route: ActivatedRoute, private addressServive: AddressService) {
    this.isCorrect = true;
    this.isVisible = true;
  }

  ngOnInit(): void {
    console.log("----- result component -----")
    this.isCorrect = true;
    this.isVisible = true;
    this.route.queryParams.subscribe(params => {
      this.lat = params['lat'];
      this.lng = params['lng'];
      this.isVisible = params['display'] === 'true';
      this.isCorrect = params['rightInput'] === 'true';
      this.city = params['city'];
      this.state = params['state'];
      console.log("result param: ", this.lat, this.lng, this.isVisible, this.isCorrect);
      if (this.isCorrect && this.isVisible) {
        this.router.navigate(['/result/day-view'], {
          queryParams: {
            lat: this.lat,
            lng: this.lng,
            city: this.city,
            state: this.state,
          }
        });
      }
    });
  }

  stayStillforView() {
    this.isCorrect = true;
    this.isVisible = true;
  }
}
