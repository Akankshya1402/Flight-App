import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seat } from '../../features/flights/seat-selection/seat.model';

@Injectable({ providedIn: 'root' })
export class SeatService {

  private baseUrl = 'http://localhost:8082/api/seats';

  constructor(private http: HttpClient) {}

  // 🔹 Get all seats with status & price
  getSeatsByFlight(flightId: number): Observable<Seat[]> {
    return this.http.get<Seat[]>(`${this.baseUrl}/flight/${flightId}`);
  }
}
