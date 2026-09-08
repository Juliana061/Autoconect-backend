import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './vehicle-form.component.html',
})
export class VehicleFormComponent {
  form = this.fb.group({
    placa: ['', Validators.required],
    marca: [''],
    modelo: [''],
    anio: [null as number | null],
  });
  error = '';
  loading = false;

  constructor(private fb: FormBuilder, private vehicleService: VehicleService, private router: Router) {}

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.vehicleService.create(this.form.value as any).subscribe({
      next: (v) => this.router.navigate(['/vehicles', v._id]),
      error: (err) => {
        this.error = err?.error?.message || 'Error al crear el vehículo';
        this.loading = false;
      },
    });
  }
}
