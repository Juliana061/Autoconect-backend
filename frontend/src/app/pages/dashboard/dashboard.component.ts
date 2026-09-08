import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { DocumentService } from '../../core/services/document.service';
import { Vehicle, VehicleDocument } from '../../core/models/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  vehicles: Vehicle[] = [];
  documents: VehicleDocument[] = [];
  loading = true;

  constructor(
    public auth: AuthService,
    private vehicleService: VehicleService,
    private documentService: DocumentService
  ) {}

  ngOnInit() {
    forkJoin({
      vehicles: this.vehicleService.getAll(),
      documents: this.documentService.getAll(),
    }).subscribe({
      next: ({ vehicles, documents }) => {
        this.vehicles = vehicles;
        this.documents = documents;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  get vencidos() {
    return this.documents.filter((d) => d.estado === 'vencido').length;
  }

  get porVencer() {
    return this.documents.filter((d) => d.estado === 'por_vencer').length;
  }

  get vigentes() {
    return this.documents.filter((d) => d.estado === 'vigente').length;
  }

  get whatsappBotUrl(): string | null {
    const numero = environment.whatsappBotNumber;
    if (!numero) return null;
    const mensaje = encodeURIComponent('Hola, quiero consultar el estado de mis documentos.');
    return `https://wa.me/${numero}?text=${mensaje}`;
  }
}
