import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent {
  clientName = 'Nombre Cliente';
  selectedView = 'requested';
  
  viewTitles = {
    requested: 'Trabajos Solicitados',
    completed: 'Trabajos Realizados',
    settings: 'Configuración'
  };

  changeView(view: string) {
    this.selectedView = view;
  }
}