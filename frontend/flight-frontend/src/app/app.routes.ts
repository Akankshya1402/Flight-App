import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { SearchFlightsComponent } from './features/flights/search-flights/search-flights.component';
import { BookComponent } from './features/flights/book/book';
import { ViewBookingComponent } from './features/flights/view-booking-component/view-booking-component';
import { ChangePasswordComponent } from './features/auth/change-password/change-password.component';
import { AddFlightComponent } from './features/flights/add-flight/add-flight';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  // ✅ PUBLIC HOME PAGE
  { path: '', component: HomeComponent },

  // ✅ AUTH (PUBLIC)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 🔒 USER PROTECTED
  {
    path: 'search-flights',
    component: SearchFlightsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'book-flights/:id',
    component: BookComponent,
    canActivate: [authGuard],
  },
  {
    path: 'view-booking',
    component: ViewBookingComponent,
    canActivate: [authGuard],
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [authGuard],
  },

  // 🔒 ADMIN (role check inside guard)
  {
    path: 'add-flight',
    component: AddFlightComponent,
    canActivate: [authGuard],
  },

  // ❌ INVALID URL HANDLER
  { path: '**', redirectTo: '' }
];
