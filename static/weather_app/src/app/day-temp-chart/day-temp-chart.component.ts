import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Router, ActivatedRoute, RouterLink} from '@angular/router';
import {HighchartsChartModule} from 'highcharts-angular';
import Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';

import {environment} from '../../environment';

if (typeof Highcharts === 'object') {
  HC_more(Highcharts);
}
@Component({
  selector: 'app-day-temp-chart',
  standalone: true,
  imports: [RouterModule, CommonModule, HighchartsChartModule],
  templateUrl: './day-temp-chart.component.html',
  styleUrl: './day-temp-chart.component.css'
})
export class DayTempChartComponent implements OnInit {
  lat: string | null = '';
  lng: string | null = '';
  city: string | null = '';
  state: string | null = '';

  detailStr: string | null = '';

  data: number[][] = [
    // [1634504400000, 43, 88],
    // [1634590800000, 37, 78],
    // [1634677200000, 56, 90],
  ];

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log("----- temp chart component -----");
    this.route.queryParams.subscribe(params => {
      this.lat = params['lat'];
      this.lng = params['lng'];
      this.city = params['city'];
      this.state = params['state'];
      this.detailStr = params['detailStr'];
      console.log("temp chart data: ", this.lat, this.lng);
      // let url = `http://517hw3-env.eba-8t2mutu3.us-east-1.elasticbeanstalk.com/weatherdatachart1?latitude=${this.lat}&longitude=${this.lng}`;
      let url = `${environment.apiBaseUrl}/weatherdatachart1?latitude=${this.lat}&longitude=${this.lng}`;
      console.log("temp chart url:", url);
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const tempData = (data as { chart1Results: any[] }).chart1Results;
          console.log("temp chart raw data:", tempData)
          for (let row of tempData){
            let dataRow = JSON.stringify((row as { dataRow: any[]}).dataRow).split("\"")[1].split("@");
            // console.log(dataRow)
            this.data.push(dataRow.map(item => parseFloat(item)));
          }
          console.log("temp chart data:", this.data);

          this.chartOptions = {
            chart: {
              type: 'arearange',
              zooming: {
                type: 'x'
              }
            },
            series: [
              {
                type: 'arearange',
                name: 'Temperatures',
                data: this.data,
                zIndex: 1,
                color: {
                  linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
                  stops: [
                    [0, '#FFA500'],
                    [1, '#ADD8E6']
                  ]
                }
              },
            ],
            title: {
              text: 'Temperature Range (Min, Max)'
            },
            xAxis: {
              type: 'datetime',
              accessibility: {
                rangeDescription: 'Range: next 15 days.'
              },
              crosshair: {
                color: '#FF0000', // 设置 X 轴准星线的颜色
                width: 1,
                dashStyle: 'ShortDash'
              }
            },
            yAxis: {
              title: {
                text: ''
              },
              crosshair: {
                color: '#00FF00', // 设置 Y 轴准星线的颜色
                width: 1
              }
            },
            tooltip: {
              // crosshairs: true
              valueSuffix: '°F',
              xDateFormat: '%A, %b %e',
            },
          };
        })
        .catch(error => {
          console.error('Error on Temp Chart Response:', error);
        });
    });
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
}
