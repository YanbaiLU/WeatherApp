import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {

  private apiLoaded = false;

  // Your Google Maps API Key
  private apiKey = 'YOUR_API_KEY';

  load(): Promise<void> {
    if (this.apiLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.apiLoaded = true;
        resolve();
      };

      script.onerror = (error:ErrorEvent) => {
        reject(error);
      };

      document.head.appendChild(script);
    });
  }
  constructor() { }
}
