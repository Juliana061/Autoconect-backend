import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VehicleDocument } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private base = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<VehicleDocument[]> {
    return this.http.get<VehicleDocument[]>(this.base);
  }

  upload(vehicleId: string, formData: FormData): Observable<VehicleDocument> {
    return this.http.post<VehicleDocument>(`${this.base}/vehicle/${vehicleId}`, formData);
  }

  update(id: string, data: Partial<VehicleDocument>): Observable<VehicleDocument> {
    return this.http.put<VehicleDocument>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
