import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent {
  constructor(private router: Router ) {}
  companyName: string = '';
  defaultLanguage: string = 'Español';
  timezone: string = 'América/Ciudad de México';
  theme: 'light' | 'dark' = 'light';

  languages = [
    'Español', 
    'Inglés'
  ];

  timezones = [
    'América/Ciudad de México',
    'América/Buenos Aires'
  ];

  saveConfiguration() {
    // Lógica para guardar configuración
    console.log('Configuración guardada:', {
      companyName: this.companyName,
      language: this.defaultLanguage,
      timezone: this.timezone,
      theme: this.theme
    });
  }
  goBack(): void {
    this.router.navigate(['/admin1']);
  }
}
