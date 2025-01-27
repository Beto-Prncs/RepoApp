import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  constructor(private router: Router) {}
  getCreateAcount()
  {
    this.router.navigate(['/UserCreate']);
  }
  getReports()
  {
    this.router.navigate(['/reports']);
  }
  getStatistics()
  {
    this.router.navigate(['/statistics']);
  }
  getConfiguration()
  {
    this.router.navigate(['/configuration']);
  }
}
