import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vehicle, VehicleDocument, User } from '../models/models';

export interface AdminSummary {
  totalUsers: number;
  totalVehicles: number;
  totalDocuments: number;
  vencidos: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<AdminSummary> {
    return this.http.get<AdminSummary>(`${this.base}/summary`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/users`);
  }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.base}/vehicles`);
  }

  getDocuments(): Observable<VehicleDocument[]> {
    return this.http.get<VehicleDocument[]>(`${this.base}/documents`);
  }
}
