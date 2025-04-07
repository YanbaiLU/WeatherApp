export  interface WeatherResults{
  weatherInfoList: WeatherInfo[];
}
export interface WeatherInfo {
  date: string;
  status: string;
  imgPath: string;
  tempHigh: string;
  tempLow: string;
  windSpeed: string;
  tempApp: string;
  sunRise: string;
  sunSet: string;
  humidity: string;
  visibility: string;
  cloudCover: string;

}
