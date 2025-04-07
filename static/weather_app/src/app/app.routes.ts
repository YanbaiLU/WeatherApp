import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ResultComponent} from './result/result.component';
import {FavoriteComponent} from './favorite/favorite.component';
import {DayViewComponent} from './day-view/day-view.component';
import {DayTempChartComponent} from './day-temp-chart/day-temp-chart.component';
import {MetegramComponent} from './metegram/metegram.component';
import {SearchFormComponent} from './search-form/search-form.component';
// import {YourComponentNameComponent} from './your-component-name/your-component-name.component';
import {DetailComponent} from './detail/detail.component';

export const routes: Routes = [
  {path: '', redirectTo: 'result', pathMatch: 'full'},
  {path: 'form', component:SearchFormComponent, pathMatch: 'full'},
  {path: 'result', component: ResultComponent, pathMatch: 'full'},
  // {path: 'favorite', component: FavoriteComponent, pathMatch: 'full'},
  {path: 'result/day-view', component: DayViewComponent, pathMatch: 'full'},
  {path: 'result/day-temp-chart', component: DayTempChartComponent, pathMatch: 'full'},
  {path: 'result/metegram', component: MetegramComponent, pathMatch: 'full'},
  {path: 'result/detail', component: DetailComponent, pathMatch: 'full'},
  // { path: '', redirectTo: '/result', pathMatch: 'full' },
  // {path: 'blank', redirectTo: "/result", pathMatch: 'full'},
  // {
  //   path: 'result',
  //   component: ResultComponent,
  //   children: [
  //     {path: 'default', component: YourComponentNameComponent, pathMatch: 'full'},
  //     {path: 'day-temp-chart', component: DayTempChartComponent, pathMatch: 'full'},
  //     {path: 'metegram', component: MetegramComponent, pathMatch: 'full'},
  //     {path: 'detail', component: DetailComponent, pathMatch: 'full'},
  //     {path: 'day-view', component: DayViewComponent,pathMatch: 'full'},
  //   ],
  //   data: {animation: 'resultsPage'},
  // },
  // {path: 'favorite', component: FavoriteComponent, data: {animation: 'favoritesPage'}},

];
