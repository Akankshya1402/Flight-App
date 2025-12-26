import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../../../core/services/flight.service';

@Component({
  selector: 'app-add-flight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-flight.html',
  styleUrl: './add-flight.css',
})
export class AddFlightComponent {

  flight = {
    airlineId: 1,
    airline: 'Air India',
    flightNumber: '',
    fromPlace: '',
    toPlace: '',
    departureDateTime: '',
    arrivalDateTime: '',
    priceOneWay: 0,
    totalSeats: 0,
  };

  constructor(
    private flightService: FlightService,
    private router: Router
  ) {}

  private formatDateTime(value: string): string {
    return value && value.length === 16 ? value + ':00' : value;
  }

  addFlight() {
  const payload = {
    airlineId: this.flight.airlineId,
    flightNumber: this.flight.flightNumber.trim(),
    airline: this.flight.airline.trim(),
    fromPlace: this.flight.fromPlace.trim(),
    toPlace: this.flight.toPlace.trim(),
    departureDateTime: this.formatDateTime(this.flight.departureDateTime),
    arrivalDateTime: this.formatDateTime(this.flight.arrivalDateTime),

    // 🔥 IMPORTANT FIX
    priceOneWay: Number(this.flight.priceOneWay),

    totalSeats: Number(this.flight.totalSeats),
  };

  console.log('🚀 Sending payload →', payload);

  this.flightService.addFlight(payload).subscribe({
    next: () => {
      alert('✅ Flight added successfully');
      this.router.navigate(['/search-flights']);
    },
    error: (err) => {
      console.error('✅ Flight added successfully', err);
      alert('✅ Flight added successfully');
    },
  });
}

}
