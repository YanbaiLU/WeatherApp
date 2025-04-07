import { Component } from '@angular/core';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [],
  template: `
    <div class="container my-3 alert alert-warning" role="alert">
      Sorry. No records found.
    </div>
  `,
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent {

}
