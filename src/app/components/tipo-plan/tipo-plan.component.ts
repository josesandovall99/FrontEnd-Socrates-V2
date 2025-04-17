import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoPlanService } from 'src/app/services/tipo-plan.service';


@Component({
  selector: 'app-tipo-plan',
  standalone: true,
  templateUrl: './tipo-plan.component.html',
  styleUrls: ['./tipo-plan.component.css'],
  imports: [ReactiveFormsModule]
})
export class TipoPlanComponent {
  tipoPlanForm: FormGroup;

  constructor(private fb: FormBuilder, private tipoPlanService: TipoPlanService) {
    this.tipoPlanForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      estado: [true, Validators.required]
    });
  }

  onSubmit() {
    if (this.tipoPlanForm.valid) {
      this.tipoPlanService.createTipoPlan(this.tipoPlanForm.value).subscribe(
        response => console.log('Tipo de Plan registrado:', response),
        error => console.error('Error al registrar el Tipo de Plan:', error)
      );
    }
  }
}
