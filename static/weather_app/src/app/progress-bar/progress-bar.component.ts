import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit, OnDestroy {
  progress = 0;
  isVisible = true;
  private intervalId: any;

  ngOnInit() {
    this.startProgress();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startProgress() {
    const duration = 50;
    const interval = 10;
    const increment = 100 / (duration / interval);

    this.intervalId = setInterval(() => {
      this.progress += increment;
      if (this.progress >= 100) {
        this.progress = 100;
        this.isVisible = false;
        clearInterval(this.intervalId);
      }
    }, interval);
  }
}
