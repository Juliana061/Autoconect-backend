import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vehicle, VehicleDocument } from '../models/models';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private base = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.base);
  }

  getOne(id: string): Observable<{ vehicle: Vehicle; documents: VehicleDocument[] }> {
    return this.http.get<{ vehicle: Vehicle; documents: VehicleDocument[] }>(`${this.base}/${id}`);
  }

  create(data: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.base, data);
  }

  update(id: string, data: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
