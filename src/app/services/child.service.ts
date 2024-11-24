import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parent } from './parent.service';

export interface Child {
  _id?: string;
  name: string;
  dateOfBirth: Date;
  parentId: string;
  parent?: Parent;
}

@Injectable({
  providedIn: 'root'
})
export class ChildService {
  private apiUrl = 'http://localhost:3000/api/children';

  constructor(private http: HttpClient) {}

  getChildren(): Observable<Child[]> {
    return this.http.get<Child[]>(this.apiUrl);
  }

  addChild(child: Child): Observable<Child> {
    return this.http.post<Child>(this.apiUrl, child);
  }

  updateChild(child: Child): Observable<Child> {
    return this.http.put<Child>(`${this.apiUrl}/${child._id}`, child);
  }

  deleteChild(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}