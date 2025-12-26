export interface Seat {
  seatNumber: string;
  status: 'AVAILABLE' | 'LOCKED' | 'BOOKED';
  price: number;
}
