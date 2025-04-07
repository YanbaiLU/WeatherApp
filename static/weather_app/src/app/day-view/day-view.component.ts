import {Component, OnInit} from '@angular/core';
import {AddressService} from '../address.service';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {RouterModule, Router, ActivatedRoute, RouterLink, RouterOutlet} from '@angular/router';

import {WeatherInfo} from '../app.interface';
import {ProgressBarComponent} from '../progress-bar/progress-bar.component';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ActivatedRouteOutlet } from '@angular/router';
import {trigger, transition, style, animate} from '@angular/animations';

import {environment} from '../../environment';


@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [RouterModule, CommonModule, ProgressBarComponent],
  templateUrl: `./day-view.component.html`,
  styleUrl: './day-view.component.css',
  providers: [HttpClient],
  animations: [
    trigger('routeAnimation', [
      transition('* <=> *', [
        // Start off-screen to the left (translateX: -100%)
        style({position: 'absolute', width: '100%', transform: 'translateX(-100%)'}),
        // Slide to the center (translateX: 0)
        animate('0.5s ease-in-out', style({transform: 'translateX(0)'}))
      ])
    ])
  ]
})
export class DayViewComponent implements OnInit {
  address: string = "LA";
  data: any;
  lat: string | null = '';
  lng: string | null = '';
  isVisible: boolean = false;
  city: string | null = '';
  state: string | null = '';
  detailStr: string | null = '';

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

  constructor(private sharedService: AddressService, private router: Router, private route: ActivatedRoute) {
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] || '';
  }

  ngOnInit() {
    console.log("----- day-view component -----")
    this.route.queryParams.subscribe(params => {
      this.lat = params['lat'];
      this.lng = params['lng'];
      this.city = params['city'];
      this.state = params['state'];
      this.isVisible = params['display']
      this.detailStr = params['detailStr'];
      console.log("data to day-view: ", this.lat, this.lng, this.isVisible);
      if (this.lat && this.lng) {
        // let url = `http://517hw3-env.eba-8t2mutu3.us-east-1.elasticbeanstalk.com/weatherdata?latitude=${this.lat}&longitude=${this.lng}`;
        let url = `${environment.apiBaseUrl}/weatherdata?latitude=${this.lat}&longitude=${this.lng}`;
        console.log("back end url:", url);
        fetch(url)
          .then(response => response.json())
          .then(data => {
            console.log('Weather Response:', data);
            this.weatherInfoList = (data as { results: any[] }).results;
            this.weatherInfo0 = (data as { results: any[] }).results[0];
            // this.weatherInfo0.cloudCover = this.weatherInfo0.cloudCover + "%";
            // this.weatherInfo0.windSpeed = this.weatherInfo0.windSpeed + "mph";
            // this.weatherInfo0.tempLow = this.weatherInfo0.tempLow + "°F";
            // this.weatherInfo0.tempApp = this.weatherInfo0.tempApp + "°F";
            // this.weatherInfo0.tempHigh = this.weatherInfo0.tempHigh + "°F";
            // this.weatherInfo0.humidity = this.weatherInfo0.humidity + "%";
            // this.weatherInfo0.visibility = this.weatherInfo0.visibility + "mi";
            console.log("detailStr", this.detailStr);
            if (this.detailStr === "" || this.detailStr === undefined) {
              this.detailStr = this.weatherInfo0.status + "@" + this.weatherInfo0.tempHigh + "@" + this.weatherInfo0.tempLow + "@" + this.weatherInfo0.tempApp + "@" + this.weatherInfo0.sunRise + "@" + this.weatherInfo0.sunSet + "@" + this.weatherInfo0.humidity + "@" + this.weatherInfo0.windSpeed + "@" + this.weatherInfo0.visibility + "@" + this.weatherInfo0.cloudCover + "@" + this.weatherInfo0.date;
            }
            console.log('weatherInfoList:', this.weatherInfoList);
          })
          .catch(error => {
            console.error('Error on Weather Response:', error);
          });
      }
    });
  }

  routeToDetail(item: WeatherInfo) {
    item.cloudCover = item.cloudCover + "%";
    item.windSpeed = item.windSpeed + "mph";
    item.tempLow = item.tempLow + "°F";
    item.tempApp = item.tempApp + "°F";
    item.tempHigh = item.tempHigh + "°F";
    item.humidity = item.humidity + "%";
    item.visibility = item.visibility + "mi";
    let t = item.status + "@" + item.tempHigh + "@" + item.tempLow + "@" + item.tempApp + "@" + item.sunRise + "@" + item.sunSet + "@" + item.humidity + "@" + item.windSpeed + "@" + item.visibility + "@" + item.cloudCover + "@" + item.date;
    this.detailStr = t;
    this.router.navigate(
      ['/result/detail'],
      {
        queryParams: {
          dataDay: t,
          lat: this.lat,
          lng: this.lng,
          city: this.city,
          state: this.state,
        }
      })
  }

  DetailsToDetail() {
    this.router.navigate(
      ['/result/detail'],
      {
        queryParams: {
          dataDay: this.detailStr,
          lat: this.lat,
          lng: this.lng,
          city: this.city,
          state: this.state,
        }
      })
  }

  imgRoute(item: WeatherInfo) {
    console.log(item)
    let imgRoute0;
    if (item.status === 'Clear') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/clear_day.svg";
    } else if (item.status === 'Cloudy') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/cloudy.svg";
    } else if (item.status === 'Drizzle') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/drizzle.svg";
    } else if (item.status === 'Flurries') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/flurries.svg";
    } else if (item.status === 'Fog') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/fog.svg";
    } else if (item.status === 'Light Fog') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/fog_light.svg";
    } else if (item.status === 'Freezing Drizzle') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/freezing_drizzle.svg";
    } else if (item.status === 'Freezing Rain') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/freezing_rain.svg";
    } else if (item.status === 'Heavy Freezing Rain') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/freezing_rain_heavy.svg";
    } else if (item.status === 'Light Freezing Rain') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/freezing_rain_light.svg";
    } else if (item.status === 'Ice Pellets') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/ice_pellets.svg";
    } else if (item.status === 'Heavy Ice Pellets') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/ice_pellets_heavy.svg";
    } else if (item.status === 'Light Ice Pellets') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/ice_pellets_light.svg";
    } else if (item.status === 'Mostly Clear') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/mostly_clear_day.svg";
    } else if (item.status === 'Mostly Cloudy') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/mostly_cloudy.svg";
    } else if (item.status === 'Partly Cloudy') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/partly_cloudy_day.svg";
    } else if (item.status === 'Rain') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/rain.svg";
    } else if (item.status === 'Heavy Rain') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/rain_heavy.svg";
    } else if (item.status === 'Light Rain') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/rain_light.svg";
    } else if (item.status === 'Snow') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/snow.svg";
    } else if (item.status === 'Heavy Snow') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/snow_heavy.svg";
    } else if (item.status === 'Light Snow') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/snow_light.svg";
    } else if (item.status === 'Thunderstorm') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/tstorm.svg";
    } else if (item.status === 'Light Wind') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/light_wind.jpg";
    } else if (item.status === 'Wind') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/wind.png";
    } else if (item.status === 'Strong-Wind') {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/strong-wind.png";
    } else {
      imgRoute0 = "/WeatherSymbolsforWeatherCodes/default.svg"; // 默认值
    }

    // let imgRoute = `/WeatherSymbolsforWeatherCodes/clear_day.svg`;
    // let imgRoute1 = `${item.imgPath.trim()}`;
    // encodeURIComponent(imgRoute1)
    // console.log(imgRoute, imgRoute1, (imgRoute === imgRoute1), typeof imgRoute1, typeof imgRoute0);
    return imgRoute0;
  }


}
