import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { DocumentService } from '../../core/services/document.service';
import { Vehicle, VehicleDocument } from '../../core/models/models';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './vehicle-detail.component.html',
})
export class VehicleDetailComponent implements OnInit {
  vehicleId = '';
  vehicle: Vehicle | null = null;
  documents: VehicleDocument[] = [];
  loading = true;
  uploading = false;
  error = '';
  selectedFile: File | null = null;

  form = this.fb.group({
    tipo: ['SOAT', Validators.required],
    numero: [''],
    fechaExpedicion: [''],
    fechaVencimiento: ['', Validators.required],
  });

  tipos = [
    { value: 'SOAT', label: 'SOAT' },
    { value: 'Tecnomecanica', label: 'Tecnomecánica' },
    { value: 'Licencia', label: 'Licencia de conducción' },
    { value: 'Tarjeta_Propiedad', label: 'Tarjeta de propiedad' },
    { value: 'Otro', label: 'Otro' },
  ];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private documentService: DocumentService
  ) {}

  ngOnInit() {
    this.vehicleId = this.route.snapshot.paramMap.get('id') || '';
    this.load();
  }

  load() {
    this.loading = true;
    this.vehicleService.getOne(this.vehicleId).subscribe({
      next: ({ vehicle, documents }) => {
        this.vehicle = vehicle;
        this.documents = documents;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  submitDocument() {
    if (this.form.invalid || !this.selectedFile) {
      this.form.markAllAsTouched();
      if (!this.selectedFile) this.error = 'Debes adjuntar el archivo del documento';
      return;
    }
    this.uploading = true;
    this.error = '';

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (value) formData.append(key, value as string);
    });
    formData.append('archivo', this.selectedFile);

    this.documentService.upload(this.vehicleId, formData).subscribe({
      next: () => {
        this.uploading = false;
        this.selectedFile = null;
        this.form.reset({ tipo: 'SOAT' });
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al subir el documento';
        this.uploading = false;
      },
    });
  }

  deleteDocument(id: string) {
    if (!confirm('¿Eliminar este documento?')) return;
    this.documentService.delete(id).subscribe(() => this.load());
  }

  estadoLabel(estado: string) {
    return { vigente: 'Vigente', por_vencer: 'Por vencer', vencido: 'Vencido' }[estado] || estado;
  }
}
