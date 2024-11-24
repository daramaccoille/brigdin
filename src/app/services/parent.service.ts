import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Parent {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private apiUrl = 'http://localhost:3000/api/parents';

  constructor(private http: HttpClient) {}

  getParents(): Observable<Parent[]> {
    return this.http.get<Parent[]>(this.apiUrl);
  }

  addParent(parent: Parent): Observable<Parent> {
    return this.http.post<Parent>(this.apiUrl, parent);
  }

  updateParent(parent: Parent): Observable<Parent> {
    return this.http.put<Parent>(`${this.apiUrl}/${parent._id}`, parent);
  }

  deleteParent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}