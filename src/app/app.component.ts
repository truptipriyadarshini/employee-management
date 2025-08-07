import { Component } from '@angular/core';
import { EmployeeComponent } from './employee/employee.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
   imports: [RouterOutlet], // ✅ Register RouterOutlet for routing
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'employee-ui';
}
