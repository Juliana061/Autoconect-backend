import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { GestorService, GestorSummary } from '../../core/services/gestor.service';
import { VehicleDocument, User, Vehicle } from '../../core/models/models';

@Component({
  selector: 'app-gestor',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gestor.component.html',
})
export class GestorComponent implements OnInit {
  summary: GestorSummary | null = null;
  documents: VehicleDocument[] = [];
  loading = true;
  updatingId: string | null = null;

  constructor(public auth: AuthService, private gestorService: GestorService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    forkJoin({
      summary: this.gestorService.getSummary(),
      documents: this.gestorService.getDocuments(),
    }).subscribe({
      next: ({ summary, documents }) => {
        this.summary = summary;
        this.documents = documents;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  ownerName(d: VehicleDocument): string {
    const owner = d.owner as User;
    if (owner && typeof owner === 'object') {
      return `${owner.nombre} (${owner.email})`;
    }
    return 'N/A';
  }

  vehiclePlaca(d: VehicleDocument): string {
    const v = d.vehicle as Vehicle;
    if (v && typeof v === 'object') {
      return `${v.placa} — ${v.marca ?? ''} ${v.modelo ?? ''}`.trim();
    }
    return 'N/A';
  }

  toggleValidado(doc: VehicleDocument) {
    this.updatingId = doc._id;
    this.gestorService.setValidado(doc._id, !doc.validado).subscribe({
      next: (updated) => {
        const idx = this.documents.findIndex((d) => d._id === updated._id);
        if (idx > -1) this.documents[idx] = updated;
        this.updatingId = null;
      },
      error: () => (this.updatingId = null),
    });
  }
}
