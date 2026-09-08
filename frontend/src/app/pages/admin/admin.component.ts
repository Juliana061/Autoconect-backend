import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AdminService, AdminSummary } from '../../core/services/admin.service';
import { Vehicle, User } from '../../core/models/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  summary: AdminSummary | null = null;
  vehicles: Vehicle[] = [];
  users: User[] = [];
  loading = true;

  constructor(public auth: AuthService, private adminService: AdminService) {}

  ngOnInit() {
    forkJoin({
      summary: this.adminService.getSummary(),
      vehicles: this.adminService.getVehicles(),
      users: this.adminService.getUsers(),
    }).subscribe({
      next: ({ summary, vehicles, users }) => {
        this.summary = summary;
        this.vehicles = vehicles;
        this.users = users;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  ownerName(v: Vehicle): string {
    const owner = v.owner as any;
    if (owner && typeof owner === 'object') {
      return `${owner.nombre} (${owner.email})`;
    }
    return 'N/A';
  }
}
