import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vehicle, VehicleDocument } from '../models/models';

export interface GestorSummary {
  totalDocuments: number;
  validados: number;
  pendientes: number;
  vencidos: number;
}

@Injectable({ providedIn: 'root' })
export class GestorService {
  private base = `${environment.apiUrl}/gestor`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<GestorSummary> {
    return this.http.get<GestorSummary>(`${this.base}/summary`);
  }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.base}/vehicles`);
  }

  getDocuments(): Observable<VehicleDocument[]> {
    return this.http.get<VehicleDocument[]>(`${this.base}/documents`);
  }

  setValidado(id: string, validado: boolean): Observable<VehicleDocument> {
    return this.http.patch<VehicleDocument>(`${this.base}/documents/${id}/validado`, { validado });
  }
}
