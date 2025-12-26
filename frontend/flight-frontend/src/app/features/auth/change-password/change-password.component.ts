import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  error = '';
  success = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  changePassword() {

  this.error = '';
  this.success = '';

  if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
    this.error = 'All fields are required';
    return;
  }

  if (this.newPassword.length < 3) {
    this.error = 'New password must be at least 3 characters';
    return;
  }

  if (this.newPassword !== this.confirmPassword) {
    this.error = 'Passwords do not match';
    return;
  }

  const email = localStorage.getItem('userEmail');
  if (!email) {
    this.error = 'User not logged in';
    return;
  }

  this.authService.changePassword({
    email,
    oldPassword: this.oldPassword,
    newPassword: this.newPassword
  }).subscribe({
    next: (res: any) => {
      console.log('Backend response:', res);

      // ✅ SUCCESS UI
      this.success = 'Password changed successfully';
      this.error = '';

      // ✅ ALERT
      alert('✅ Password changed successfully!');

      // optional: clear fields
      this.oldPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    },
    error: (err) => {
      console.error(err);
      this.error = err?.error || 'Password change failed';
      this.success = '';
    }
  });
}

}
