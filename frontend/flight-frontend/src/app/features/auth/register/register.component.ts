import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  email = '';
  password = '';
  fullName = '';
  role = 'ROLE_USER';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
  this.error = '';

  // Required fields
  if (!this.fullName || !this.email || !this.password) {
    this.error = 'All fields are required';
    return;
  }

  // Full name length
  if (this.fullName.length < 3) {
    this.error = 'Full name must be at least 3 characters';
    return;
  }

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.email)) {
    this.error = 'Enter a valid email address';
    return;
  }

  // Strong password rule
  if (this.password.length < 6) {
    this.error = 'Password must be at least 6 characters';
    return;
  }

  this.authService.register({
    email: this.email.trim(),
    password: this.password,
    fullName: this.fullName.trim(),
    role: this.role
  }).subscribe({
    next: () => {
      this.router.navigate(['/login']);
    },
    error: (err) => {
      if (err.status === 409) {
        this.error = 'Email already exists';
      } else {
        this.error = 'Registration failed';
      }
    }
  });
}

}
