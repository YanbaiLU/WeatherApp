import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {HttpClient, HttpClientJsonpModule} from '@angular/common/http';
import {AddressService} from '../address.service';
import {Router, RouterModule} from '@angular/router';
import {RouterOutlet, RouterLink} from '@angular/router';
import {WeatherInfo, WeatherResults} from '../app.interface';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import {MatFormFieldModule} from '@angular/material/form-field';

import { FormsModule } from '@angular/forms';

import { environment} from '../../environment';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    HttpClientJsonpModule,
    FormsModule,
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css',
  providers: [RouterLink],
})
export class SearchFormComponent implements OnInit{

  ngOnInit() {
    this.checked = false;
  }

  baseUrl = environment.apiBaseUrl;

  form: FormGroup;
  street: FormControl = new FormControl('', Validators.required);
  city: FormControl = new FormControl('', Validators.required);
  state: FormControl = new FormControl('', Validators.required);

  checkBox: FormControl = new FormControl(false);

  loc: string[] = ["", ""];
  lat: string = "";
  lng: string = "";

  checked: boolean = false;

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

  isSubmitted: boolean = false;
  isCorrect: boolean = true;
  isLockedResult: boolean = false;

  myControl = new FormControl('');
  options: string[] = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
    "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
    "Austin", "Jacksonville", "Fort Worth", "Columbus", "San Francisco",
    "Charlotte", "Indianapolis", "Seattle", "Denver", "Washington",
    "Boston", "El Paso", "Detroit", "Nashville", "Portland",
    "Memphis", "Oklahoma City", "Las Vegas", "Louisville", "Baltimore"];
  // filteredOptions: Observable<string[]>;

  searchTerm: string = '';
  filteredOptions: string[] = [];

  constructor(private http: HttpClient, private fb: FormBuilder, private sharedService: AddressService, private router: Router) {
    this.form = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      checkBox: [false],
    });

    this.checked = false;

    // this.filteredOptions = this.city.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value || ''))
    // );
  }

  onSearchInput(): void {
    console.log(this.searchTerm)
    if (this.searchTerm.length > 0) {
      this.filteredOptions = [];
      this.getSearchResults(this.searchTerm).subscribe(results => {
        let predictionsList = (results as {predictions: string}).predictions
        for (let prediction of predictionsList.split("@")){
          this.filteredOptions.push(prediction);
        }
        // this.filteredOptions = results;
      });
    }
    else if (this.searchTerm.length === 0){
      this.filteredOptions = [];
    }
  }

  getSearchResults(query: string): Observable<{ predictions: string }> {
    // const url = `http://517hw3-env.eba-8t2mutu3.us-east-1.elasticbeanstalk.com/autocomplete?input=${query}`;
    const url = `${this.baseUrl}/autocomplete?input=${query}`;
    return this.http.get<{ predictions: string }>(url);
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.options.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  onCheckboxChange(): void {
    this.checked = !this.checked;
    // this.checked = (event.target as HTMLInputElement).checked;
    if (this.checked) {
      this.fetchDataWhenChecked();
    } else {
      this.fetchDataWhenUnchecked();
    }
  }

  fetchDataWhenChecked(): void {
    fetch('https://ipinfo.io/?token=6b0e583eaf5cd8')  // 将此替换为当选中时的 URL
      .then(response => response.json())
      .then(data => {
        console.log('Checked Response:', data);
        this.loc = ((data as { loc: any[] }).loc as unknown as string).split(",");
        this.lat = this.loc[0];
        this.lng = this.loc[1];
        this.city.setValue((data as {city: string}).city);
        this.state.setValue((data as {region: string}).region);
        console.log('Response lat lng:', this.lat, this.lng);
        this.form.get('street')?.disable();
        this.form.get('city')?.disable();
        this.form.get('state')?.disable();
        this.form.get('search')?.enable();
      })
      .catch(error => {
        console.error('Error on checked:', error);
      });
  }

  fetchDataWhenUnchecked(): void {
    this.form.get('street')?.enable();
    this.form.get('city')?.enable();
    this.form.get('state')?.enable();
  }

  onSubmit() {
    console.log("------ loc submit ------");
    // this.router.navigate(['/favorite']);
    if (this.checked) {
      console.log('IP Response to loc:', this.lat, "/", this.lng);
      this.locSubmit();
    } else {
      let address = "" + this.street.value + "+" + this.city.value + "+" + this.state.value;
      address = address.replace(/ /g, "+");
      console.log("address filled in", address);
      this.addressToLocAndSubmit(address);
    }
  }

  locSubmit() {
    // let url = `http://517hw3-env.eba-8t2mutu3.us-east-1.elasticbeanstalk.com/weatherdata?lat=${this.lat}&lng=${this.lng}`;
    // let url = `http://517hw3-env.eba-8t2mutu3.us-east-1.elasticbeanstalk.com/weatherdata?latitude=${this.lat}&longitude=${this.lng}`;
    let url = `${this.baseUrl}/weatherdata?latitude=${this.lat}&longitude=${this.lng}`;
    console.log("final data to result component: ", this.lat, this.lng, url);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Weather Response:', data);
        this.weatherInfoList = (data as { results: any[] }).results;
        this.weatherInfo0 = (data as { results: any[] }).results[0];
        console.log('weatherInfoList:', JSON.stringify(this.weatherInfoList));
        if (JSON.stringify(this.weatherInfoList) === '"No records have been found"') {
          this.isCorrect = false;
        }
        this.isSubmitted = true;
        this.isLockedResult = true;
        this.router.navigate(
          ["/result"],
          {
            queryParams: {
              lat: this.lat,
              lng: this.lng,
              display: this.isSubmitted,
              rightInput: this.isCorrect,
              city: this.city.value,
              state: this.state.value,
            }
          });
        console.log("----- search form component end -----")
      })
      .catch(error => {
        console.error('Error on Weather Response:', error);
      });
  }

  addressToLocAndSubmit(address: string) {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDys1jsxVgTVvTSSKzEIxBRQTNkkV28Cys&language=EN`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Googleapis Response:', data);
        // let geo = (((data as { results: any[] }).results[0] as { geometry: any[] }).geometry[0]) as {location_type: any[]}["location_type"];
        let geo = JSON.stringify((((data as { results: any[] }).results[0] as { geometry: any[] }).geometry)).split("location")[1];
        this.lat = geo.split(",")[0].split("\"lat\":")[1];
        this.lng = geo.split(",")[1].split("\"lng\":")[1].split("}")[0];
        console.log('G Response to loc:', this.lat, "/", this.lng);
        this.locSubmit();
      })
      .catch(error => {
        console.error('Error on Googleapis Response:', error);
      });
  }

  isLockedResultChange() {
    this.isLockedResult = false;
  }

  resetWholePage() {
    this.street.setValue("");
    this.state.setValue("");
    this.city.setValue("");
    this.street.markAsUntouched();
    this.city.markAsUntouched();
    this.state.markAsUntouched();
    this.form.get('street')?.enable();
    this.form.get('city')?.enable();
    this.form.get('state')?.enable();
    this.form.get('search')?.disable();
    this.checked = false;
    this.router.navigate(['/result'], {queryParams: {lat: 1, lng: 2, display: false, rightInput: false}});
  }

  navigateToResult() {
    console.log("----- info navigate -----", this.weatherInfo0)
    this.router.navigate(['/result'], {state: {data: JSON.stringify(this.weatherInfo0)}}).then(r => r);
  }

  resultRoute() {
    if (this.isSubmitted) {
      this.router.navigate(['/result'], {queryParams: {lat: this.lat, lng: this.lng, disp: true}});
    } else {
      this.router.navigate(['/result']);
    }
  }

  favRoute() {
    this.router.navigate(['/favorite']);
  }
}
