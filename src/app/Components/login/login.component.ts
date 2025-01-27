import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
onInputChange() {
throw new Error('Method not implemented.');
}
  constructor(private router: Router) {}

  usuario = {
    email: '',
    password: ''
  }

  showError = false;

  Ingresa() {
    if (this.usuario.email === 'beto123@test.com' && this.usuario.password === '12345678') {
      this.router.navigate(['/worker']);
    } else if (this.usuario.email === 'admin@test.com' && this.usuario.password === '12345678') {  
      this.router.navigate(['/admin1']);
    } else {
      this.showError = true;
      this.usuario.password = '';
    }
  }
}