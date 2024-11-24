import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChildService, Child } from '../services/child.service';
import { ParentService, Parent } from '../services/parent.service';

@Component({
  selector: 'app-children',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="grid">
      <div class="card">
        <h2>Add New Child</h2>
        <form [formGroup]="childForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Name</label>
            <input 
              type="text" 
              id="name" 
              formControlName="name"
              class="form-control"
              [class.is-invalid]="childForm.get('name')?.invalid && childForm.get('name')?.touched"
            >
          </div>

          <div class="form-group">
            <label for="dateOfBirth">Date of Birth</label>
            <input 
              type="date" 
              id="dateOfBirth" 
              formControlName="dateOfBirth"
              class="form-control"
              [class.is-invalid]="childForm.get('dateOfBirth')?.invalid && childForm.get('dateOfBirth')?.touched"
            >
          </div>

          <div class="form-group">
            <label for="parentId">Parent</label>
            <select 
              id="parentId" 
              formControlName="parentId"
              class="form-control"
              [class.is-invalid]="childForm.get('parentId')?.invalid && childForm.get('parentId')?.touched"
            >
              <option value="">Select a parent</option>
              <option *ngFor="let parent of parents" [value]="parent._id">
                {{ parent.name }}
              </option>
            </select>
          </div>

          <button type="submit" class="btn" [disabled]="childForm.invalid">
            {{ editMode ? 'Update' : 'Add' }} Child
          </button>
        </form>
      </div>

      <div class="card">
        <h2>Children List</h2>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Parent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let child of children">
                <td>{{ child.name }}</td>
                <td>{{ child.dateOfBirth | date }}</td>
                <td>{{ child.parent?.name }}</td>
                <td>
                  <button class="btn btn-edit" (click)="editChild(child)">Edit</button>
                  <button class="btn btn-delete" (click)="deleteChild(child._id!)">Delete</button>
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
export class ChildrenComponent implements OnInit {
  children: Child[] = [];
  parents: Parent[] = [];
  childForm: FormGroup;
  editMode = false;
  currentChildId: string | null = null;

  constructor(
    private childService: ChildService,
    private parentService: ParentService,
    private fb: FormBuilder
  ) {
    this.childForm = this.fb.group({
      name: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      parentId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadChildren();
    this.loadParents();
  }

  loadChildren(): void {
    this.childService.getChildren().subscribe({
      next: (children) => this.children = children,
      error: (error) => console.error('Error loading children:', error)
    });
  }

  loadParents(): void {
    this.parentService.getParents().subscribe({
      next: (parents) => this.parents = parents,
      error: (error) => console.error('Error loading parents:', error)
    });
  }

  onSubmit(): void {
    if (this.childForm.valid) {
      const childData = this.childForm.value;
      
      if (this.editMode && this.currentChildId) {
        childData._id = this.currentChildId;
        this.childService.updateChild(childData).subscribe({
          next: () => {
            this.loadChildren();
            this.resetForm();
          },
          error: (error) => console.error('Error updating child:', error)
        });
      } else {
        this.childService.addChild(childData).subscribe({
          next: () => {
            this.loadChildren();
            this.resetForm();
          },
          error: (error) => console.error('Error adding child:', error)
        });
      }
    }
  }

  editChild(child: Child): void {
    this.editMode = true;
    this.currentChildId = child._id!;
    this.childForm.patchValue({
      name: child.name,
      dateOfBirth: new Date(child.dateOfBirth).toISOString().split('T')[0],
      parentId: child.parentId
    });
  }

  deleteChild(id: string): void {
    if (confirm('Are you sure you want to delete this child?')) {
      this.childService.deleteChild(id).subscribe({
        next: () => this.loadChildren(),
        error: (error) => console.error('Error deleting child:', error)
      });
    }
  }

  resetForm(): void {
    this.childForm.reset();
    this.editMode = false;
    this.currentChildId = null;
  }
}