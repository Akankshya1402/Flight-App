import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatService } from '../../../core/services/seat.service';
import { Seat } from './seat.model';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {

  @Input() flightId!: number;
  @Input() passengerCount!: number;
  @Input() bookedSeats: string[] = [];

  @Output() seatsConfirmed = new EventEmitter<Seat[]>();

  seats: Seat[] = [];
  selectedSeats: Seat[] = [];

  constructor(private seatService: SeatService) {}

  ngOnInit(): void {
    this.loadSeats();
  }

  // 🔹 Fetch all seats (AVAILABLE / BOOKED with price)
  loadSeats() {
    this.seatService.getSeatsByFlight(this.flightId).subscribe({
      next: seats => this.seats = seats,
      error: () => alert('Failed to load seats')
    });
  }

  // 🔹 Toggle seat selection
  toggleSeat(seat: Seat) {
    if (seat.status === 'BOOKED') return;

    const index = this.selectedSeats.findIndex(s => s.seatNumber === seat.seatNumber);

    if (index >= 0) {
      this.selectedSeats.splice(index, 1);
      seat.status = 'AVAILABLE';
    } else {
      if (this.selectedSeats.length >= this.passengerCount) {
        alert(`You can select only ${this.passengerCount} seats`);
        return;
      }
      this.selectedSeats.push(seat);
      seat.status = 'LOCKED';
    }
  }

  // 🔹 Total seat price
  totalSeatPrice(): number {
    return this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  }

  // 🔹 Confirm seat selection
  confirmSeats() {
    if (this.selectedSeats.length !== this.passengerCount) {
      alert('Select seats for all passengers');
      return;
    }

    this.seatsConfirmed.emit(this.selectedSeats);
  }
}
