import {Component, AfterViewInit, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {WeatherInfo} from '../app.interface';
import {GoogleMapsModule} from '@angular/google-maps';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) {
  }
  weatherData = [
    {label: 'Status', value: 'Fog'},
    {label: 'Max Temperature', value: '85.66°F'},
    {label: 'Min Temperature', value: '62.69°F'},
    {label: 'Apparent Temperature', value: '85.9°F'},
    {label: 'Sun Rise Time', value: '6 AM'},
    {label: 'Sun Set Time', value: '6 PM'},
    {label: 'Humidity', value: '99%'},
    {label: 'Wind Speed', value: '8.67 mph'},
    {label: 'Visibility', value: '9.94 mi'},
    {label: 'Cloud Cover', value: '100%'}
  ];
  item: string[] = [""];

  lat: string | null = '';
  lng: string | null = '';
  city: string = '';
  state: string | null = '';
  rawData: string | null = '';
  xPost: string = 'The temperature in ';

  async ngOnInit() {
    console.log("----- day-detail component -----")
    this.route.queryParams.subscribe(params => {
      this.rawData = params['dataDay'];
      this.item = params['dataDay'].split("@");
      this.lat = params['lat'];
      this.lng = params['lng'];
      this.center.lat = parseFloat(params['lat']);
      this.center.lng = parseFloat(params['lng']);
      this.markers.push({ position: { lat: this.center.lat, lng: this.center.lng }, label: this.city },)
      this.city = params['city'];
      this.state = params['state'];

      console.log("data for one day: (type)", typeof this.item, this.item);
      for (let i = 0; i < this.weatherData.length; i++) {
        this.weatherData[i].value = this.item[i];
      }
      this.xPost += this.city + ", " + this.state + " on " + this.rawData?.split("@")[10] + " is " + this.weatherData[3].value + " and the conditions are " + this.weatherData[0].value;
      console.log(this.weatherData)
      // this.initMap();
    });
  }

  initMap(center: { lat: number, lng: number }, zoom: number): void {
    const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: center,
      zoom: zoom,
    });
  }

  backToList() {
    this.router.navigate(['/result/day-view'], {
      queryParams: {
        lat: this.lat,
        lng: this.lng,
        city: this.city,
        state: this.state,
        detailStr: this.rawData,
      }
    });
  }

  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 }; // 中心位置
  zoom = 12; // 地图缩放等级

  markers = [
    { position: { lat: 37.7749, lng: -122.4194 }, label: 'San Francisco' },
  ];

}
