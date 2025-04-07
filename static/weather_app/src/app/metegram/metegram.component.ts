import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {HighchartsChartModule} from 'highcharts-angular';
import Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import Windbarb from 'highcharts/modules/windbarb';

import {environment} from '../../environment';

if (typeof Highcharts === 'object') {
  HC_more(Highcharts);
  Windbarb(Highcharts);
}

@Component({
  selector: 'app-metegram',
  standalone: true,
  imports: [CommonModule, RouterModule, HighchartsChartModule],
  templateUrl: './metegram.component.html',
  styleUrl: './metegram.component.css'
})
export class MetegramComponent implements OnInit {
  lat: string | null = '';
  lng: string | null = '';
  city: string | null = '';
  state: string | null = '';

  detailStr: string | null = '';

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  data: number[][] = [];
  hasPrecipitationError = false;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log("----- metegram component -----")
    this.route.queryParams.subscribe(params => {
      this.lat = params['lat'];
      this.lng = params['lng'];
      this.city = params['city'];
      this.state = params['state'];
      this.detailStr = params['detailStr'];
      console.log("data to metegram: ", this.lat, this.lng);
      // let url = `http://517hw3-env.eba-8t2mutu3.us-east-1.elasticbeanstalk.com/weatherdatachart2?latitude=${this.lat}&longitude=${this.lng}`;
      let url = `${environment.apiBaseUrl}/weatherdatachart2?latitude=${this.lat}&longitude=${this.lng}`;
      console.log("metegram url:", url);

      fetch(url)
        .then(response => response.json())
        .then(data => {
          const tempData = (data as { chart2Results: any[] }).chart2Results;
          console.log("metegram raw data:", tempData);
          for (let row of tempData) {
            let dataRow = JSON.stringify((row as { dataRow: any[] }).dataRow).split("\"")[1].split("@");
            // console.log(dataRow)
            this.data.push(dataRow.map(item => parseFloat(item)));
          }
          console.log("metegram data:", this.data.length, this.data);

          this.chartOptions = {
            chart: {
              type: 'spline'
            },
            defs: {
              patterns: [
                {
                  id: 'precipitation-error',
                  path: {
                    d: 'M 3.3 0 L -6.7 10 M 6.7 0 L -3.3 10 M 10 0 L 0 10 M 13.3 0 L 3.3 10 M 16.7 0 L 6.7 10',
                    stroke: '#68CFE8',
                    strokeWidth: 1,
                  },
                },
              ],
            },
            title: {
              text: 'Hourly Weather (For Next 5 days)',
              align: 'center',
              style: {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              },
            },
            credits: {
              text: 'Forecast',
              href: 'https://yr.no',
              position: {x: -40},
            },
            tooltip: {
              shared: true,
              useHTML: true,
              headerFormat:
                '<small>{point.x:%A, %b %e, %H:%M}' +
                '{point.point.to:%H:%M}</small>' +
                '<b>{point.point.symbolName}</b><br>',
            },
            xAxis: [
              {
                type: 'datetime',
                tickInterval: 2 * 36e5,
                minorTickInterval: 36e5,
                tickLength: 0,
                gridLineWidth: 1,
                gridLineColor: 'rgba(128, 128, 128, 0.1)',
                startOnTick: false,
                endOnTick: false,
                minPadding: 0,
                maxPadding: 0,
                offset: 30,
                showLastLabel: true,
                labels: {format: '{value:%H}'},
                crosshair: true,
              },
              {
                linkedTo: 0,
                type: 'datetime',
                tickInterval: 24 * 3600 * 1000,
                labels: {
                  format:
                    '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
                  align: 'left',
                  x: 3,
                  y: 8,
                },
                opposite: true,
                tickLength: 20,
                gridLineWidth: 1,
              },
            ],
            yAxis: [
              {
                title: {text: null},
                labels: {
                  format: '{value}°',
                  style: {fontSize: '10px'},
                  x: -3,
                },
                plotLines: [{value: 0, color: '#BBBBBB', width: 1, zIndex: 2}],
                maxPadding: 0.3,
                minRange: 8,
                tickInterval: 5,
                gridLineColor: 'rgba(128, 128, 128, 0.1)',
              },
              {
                title: {text: null},
                labels: {enabled: false},
                gridLineWidth: 0,
                tickLength: 0,
                minRange: 10,
                min: 0,
              },
              {
                allowDecimals: false,
                title: {
                  text: 'inHg',
                  offset: 0,
                  align: 'high',
                  rotation: 0,
                  style: {fontSize: '10px', color: 'orange'},
                  textAlign: 'left',
                  x: 3,
                },
                labels: {
                  style: {fontSize: '8px', color: 'orange'},
                  y: 2,
                  x: 3,
                },
                gridLineWidth: 0,
                opposite: true,
                showLastLabel: false,
              },
            ],
            legend: {enabled: false},
            plotOptions: {
              series: {pointPlacement: 'between'},
            },
            series: [
              {
                name: 'Temperature',
                data: this.generateTemperatureData(),
                type: 'spline',
                marker: {
                  enabled: false,
                  states: {hover: {enabled: true}},
                },
                tooltip: {
                  pointFormat:
                    '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}°C</b><br/>',
                },
                zIndex: 1,
                color: '#FF3333',
                negativeColor: '#48AFE8',
              },
              {
                name: 'Humidity',
                data: this.generateHumidityData(),
                type: 'column',
                color: '#68CFE8',
                yAxis: 0,
                groupPadding: 0,
                pointPadding: 0,
                grouping: false,
                dataLabels: {
                  enabled: !this.hasPrecipitationError,
                  filter: {operator: '>', property: 'y', value: 0},
                  style: {
                    color: '#FFFFFF',
                    textOutline: '2px #000000',
                    fontWeight: 'bold',
                    fontSize: '10px',
                  },
                },
                tooltip: {valueSuffix: ' %'},
              },
              {
                name: 'Air pressure',
                color: 'orange',
                data: this.generatePressureData(),
                marker: {enabled: false},
                shadow: false,
                tooltip: {valueSuffix: ' inHg'},
                dashStyle: 'ShortDot',
                yAxis: 2,
              },
              {
                name: 'Wind',
                type: 'windbarb',
                id: 'windbarbs',
                color: Highcharts.getOptions().colors?.[1],
                lineWidth: 1.5,
                data: this.generateWindData(),
                vectorLength: 18,
                yOffset: -15,
                tooltip: {valueSuffix: ' mph'},
              },
            ],
          };
        })
        .catch(error => {
          console.error('Error on Temp Chart Response:', error);
        });


      // this.chartOptions = {
      //   chart: {
      //     zoomType: 'x'
      //   },
      //   title: {
      //     text: 'Hourly Weather (For Next 5 Days)'
      //   },
      //   xAxis: {
      //     type: 'datetime',
      //     tickInterval: 3600 * 1000 * 3, // 每 3 小时一个刻度
      //     labels: {
      //       format: '{value:%H:%M}',
      //     }
      //   },
      //   yAxis: [
      //     { // 温度 Y 轴
      //       title: {
      //         text: ''
      //       },
      //       opposite: false
      //     },
      //     { // 降雨量 Y 轴
      //       title: {
      //         text: ''
      //       },
      //       opposite: true
      //     },
      //     { // 风速 Y 轴
      //       title: {
      //         text: 'Wind speed (m/s)'
      //       },
      //       opposite: true,
      //       min: 0
      //     }
      //   ],
      //   tooltip: {
      //     shared: true,
      //     xDateFormat: '%Y-%m-%d %H:%M'
      //   },
      //   series: [
      //     {
      //       name: 'Temperature',
      //       type: 'spline',
      //       data: this.generateTemperatureData(),
      //       yAxis: 0,  // 使用第一个 Y 轴
      //       tooltip: {
      //         valueSuffix: '°C'
      //       }
      //     },
      //     {
      //       name: 'Rainfall',
      //       type: 'column',
      //       data: this.generateRainfallData(),
      //       yAxis: 1,  // 使用第二个 Y 轴
      //       tooltip: {
      //         valueSuffix: ' mm'
      //       }
      //     },
      //     {
      //       name: 'Wind Speed',
      //       type: 'windbarb',
      //       data: this.generateWindData(),
      //       yAxis: 2,  // 使用第三个 Y 轴
      //       tooltip: {
      //         valueSuffix: ' m/s'
      //       }
      //     }
      //   ]
      // };
    });
  }

  // 示例温度数据
  generateTemperatureData() {
    const data = [];
    // const time = (new Date()).getTime();
    for (let i = 0; i < this.data.length; i++) {
      data.push([this.data[i][0], this.data[i][3]]);
    }
    console.log("temp data len: ", data.length)
    return data;
  }

  // 示例湿度数据
  generateHumidityData() {
    const data = [];
    const time = (new Date()).getTime();
    for (let i = 0; i < this.data.length; i++) {
      data.push([this.data[i][0], this.data[i][1]]);
      // data.push([time + i * 3600 * 1000, Math.random() * 60 + 40]);
    }
    return data;
  }

  // 示例风速数据
  generateWindData() {
    const data = [];
    const time = (new Date()).getTime();
    for (let i = 0; i < this.data.length; i+=4) {
      data.push([this.data[i][0], this.data[i][5], this.data[i][4]]);
      // data.push([time + i * 3600 * 1000, Math.random() * 10, Math.random() * 360]);
    }
    return data;
  }

  generatePressureData() {
    const data = [];
    const time = (new Date()).getTime();
    for (let i = 0; i < this.data.length; i++) {
      // data.push([time + i * 3600 * 1000, Math.random() * 10 + 20]);
      data.push([this.data[i][0], this.data[i][2]]);
    }
    return data;
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
