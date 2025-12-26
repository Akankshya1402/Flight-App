import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  // constructor(private authService: AuthService) {}

  // login() {
  //   this.authService.login({
  //     email: this.email,
  //     password: this.password,
  //   }).subscribe({
  //     next: (res) => {
  //       this.authService.saveToken(res.token);
  //       alert(`Logged in as ${res.role}`);
  //     },
  //     error: () => {
  //       this.error = 'Invalid credentials';
  //     },
  //   });
  // }
  constructor(
  private authService: AuthService,
  private router: Router
) {}

login() {
  this.error = '';

  // Required check
  if (!this.email || !this.password) {
    this.error = 'Email and password are required';
    return;
  }

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.email)) {
    this.error = 'Enter a valid email address';
    return;
  }

  // Password length
  if (this.password.length < 6) {
    this.error = 'Password must be at least 6 characters';
    return;
  }

  this.authService.login({
    email: this.email.trim(),
    password: this.password
  }).subscribe({
    next: (res) => {
      this.authService.saveToken(res.token);
      localStorage.setItem('userEmail', this.email);
      localStorage.setItem('userRole', res.role);
      this.router.navigate(['/search-flights']);
    },
    error: (err) => {
      if (err.status === 401) {
        this.error = 'Invalid email or password';
      } else {
        this.error = 'Login failed. Try again.';
      }
    }
  });
}


}
