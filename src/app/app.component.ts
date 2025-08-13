import { Component } from '@angular/core';
import { EmployeeComponent } from './employee/employee.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
   imports: [RouterOutlet,HeaderComponent], // ✅ Register RouterOutlet for routing
  template: `
    <app-header></app-header>
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  title = 'employee-ui';
}
