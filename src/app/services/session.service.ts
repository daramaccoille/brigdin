import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Child } from './child.service';

export interface Session {
  _id?: string;
  childId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  type: 'hourly' | 'daily';
  pickupCost: number;
  additionalCosts: {
    description: string;
    amount: number;
  }[];
  child?: Child;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = 'http://localhost:3000/api/sessions';

  constructor(private http: HttpClient) {}

  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this.apiUrl);
  }

  addSession(session: Session): Observable<Session> {
    return this.http.post<Session>(this.apiUrl, session);
  }

  updateSession(session: Session): Observable<Session> {
    return this.http.put<Session>(`${this.apiUrl}/${session._id}`, session);
  }

  deleteSession(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}