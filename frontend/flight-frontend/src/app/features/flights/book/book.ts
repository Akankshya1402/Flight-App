import { Component, Input } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SeatSelectionComponent } from '../seat-selection/seat-selection.component';
import { FlightService } from '../../../core/services/flight.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-book',
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    SeatSelectionComponent
  ],
  templateUrl: './book.html',
  styleUrl: './book.css',
})
export class BookComponent {

  // 🔥 Seat selection state
  selectedSeats: any[] = [];
  alreadyBookedSeats: string[] = [];

  booking = {
    flightId: 1,
    userName: 'John Doe',
    userEmail: '',
    numberOfSeats: 1,
    passengers: [
      this.createPassenger()
    ],
  };

  @Input() id: string = '';
  error = '';

  constructor(
    private flightService: FlightService,
    private router: Router,
    private authservice: AuthService
  ) {}

  // Create default passenger
  createPassenger() {
    return {
      name: 'John Doe',
      age: 30,
      gender: 'MALE',
      seatNumber: '',
      mealType: 'VEG'
    };
  }

  // Sync passenger count with seats (IndiGo behaviour)
  updatePassengers() {
    const count = this.booking.numberOfSeats;

    while (this.booking.passengers.length < count) {
      this.booking.passengers.push(this.createPassenger());
    }

    while (this.booking.passengers.length > count) {
      this.booking.passengers.pop();
    }

    // 🔥 Reset seats if passenger count changes
    this.selectedSeats = [];
  }

  // 🔥 Receive seats from seat-selection component
  onSeatsConfirmed(seats: any[]) {
    this.selectedSeats = seats;

    // Map seats to passengers
    this.booking.passengers.forEach((p, index) => {
      p.seatNumber = seats[index]?.seatNumber || '';
    });
  }

  // Final booking action
  bookFlight() {
    const email = this.authservice.getUserEmail();

    if (!email) {
      this.error = 'User not logged in';
      this.router.navigate(['/login']);
      return;
    }

    // 🔥 IndiGo-level validation
    if (this.selectedSeats.length !== this.booking.numberOfSeats) {
      this.error = 'Please select seats for all passengers';
      return;
    }

    this.booking.userEmail = email;

    this.flightService.bookFlight(this.booking).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/view-booking']);
      },
      error: () => {
        this.error = 'Booking not successful';
      }
    });
  }
}
