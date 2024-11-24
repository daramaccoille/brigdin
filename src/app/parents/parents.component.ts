import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParentService, Parent } from '../services/parent.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-parents',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="grid">
      <div class="card">
        <h2>Add New Parent</h2>
        <form [formGroup]="parentForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Name</label>
            <input 
              type="text" 
              id="name" 
              formControlName="name"
              class="form-control"
              [class.is-invalid]="parentForm.get('name')?.invalid && parentForm.get('name')?.touched"
            >
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              class="form-control"
              [class.is-invalid]="parentForm.get('email')?.invalid && parentForm.get('email')?.touched"
            >
          </div>

          <div class="form-group">
            <label for="phone">Phone</label>
            <input 
              type="tel" 
              id="phone" 
              formControlName="phone"
              class="form-control"
              [class.is-invalid]="parentForm.get('phone')?.invalid && parentForm.get('phone')?.touched"
            >
          </div>

          <div class="form-group">
            <label for="address">Address</label>
            <textarea 
              id="address" 
              formControlName="address"
              class="form-control"
              [class.is-invalid]="parentForm.get('address')?.invalid && parentForm.get('address')?.touched"
            ></textarea>
          </div>

          <button type="submit" class="btn" [disabled]="parentForm.invalid">
            {{ editMode ? 'Update' : 'Add' }} Parent
          </button>
        </form>
      </div>

      <div class="card">
        <h2>Parents List</h2>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let parent of parents">
                <td>{{ parent.name }}</td>
                <td>{{ parent.email }}</td>
                <td>{{ parent.phone }}</td>
                <td>
                  <button class="btn btn-edit" (click)="editParent(parent)">Edit</button>
                  <button class="btn btn-delete" (click)="deleteParent(parent._id!)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .is-invalid {
      border-color: red;
    }
    .btn-edit {
      background-color: var(--secondary);
      margin-right: 8px;
    }
    .btn-delete {
      background-color: var(--accent);
    }
    .table-responsive {
      overflow-x: auto;
    }
  `]
})
export class ParentsComponent implements OnInit {
  parents: Parent[] = [];
  parentForm: FormGroup;
  editMode = false;
  currentParentId: string | null = null;

  constructor(
    private parentService: ParentService,
    private fb: FormBuilder
  ) {
    this.parentForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadParents();
  }

  loadParents(): void {
    this.parentService.getParents().subscribe({
      next: (parents) => this.parents = parents,
      error: (error) => console.error('Error loading parents:', error)
    });
  }

  onSubmit(): void {
    if (this.parentForm.valid) {
      const parentData = this.parentForm.value;
      
      if (this.editMode && this.currentParentId) {
        parentData._id = this.currentParentId;
        this.parentService.updateParent(parentData).subscribe({
          next: () => {
            this.loadParents();
            this.resetForm();
          },
          error: (error) => console.error('Error updating parent:', error)
        });
      } else {
        this.parentService.addParent(parentData).subscribe({
          next: () => {
            this.loadParents();
            this.resetForm();
          },
          error: (error) => console.error('Error adding parent:', error)
        });
      }
    }
  }

  editParent(parent: Parent): void {
    this.editMode = true;
    this.currentParentId = parent._id!;
    this.parentForm.patchValue({
      name: parent.name,
      email: parent.email,
      phone: parent.phone,
      address: parent.address
    });
  }

  deleteParent(id: string): void {
    if (confirm('Are you sure you want to delete this parent?')) {
      this.parentService.deleteParent(id).subscribe({
        next: () => this.loadParents(),
        error: (error) => console.error('Error deleting parent:', error)
      });
    }
  }

  resetForm(): void {
    this.parentForm.reset();
    this.editMode = false;
    this.currentParentId = null;
  }
}