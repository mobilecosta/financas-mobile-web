import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, PoModule],
  template: `<router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent {
  title = 'Financas Mobile';
}
