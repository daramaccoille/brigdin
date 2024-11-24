import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SessionService, Session } from '../services/session.service';
import { ChildService, Child } from '../services/child.service';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="grid">
      <div class="card">
        <h2>Add New Session</h2>
        <form [formGroup]="sessionForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="childId">Child</label>
            <select 
              id="childId" 
              formControlName="childId"
              class="form-control"
              [class.is-invalid]="sessionForm.get('childId')?.invalid && sessionForm.get('childId')?.touched"
            >
              <option value="">Select a child</option>
              <option *ngFor="let child of children" [value]="child._id">
                {{ child.name }} ({{ child.parent?.name }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="date">Date</label>
            <input 
              type="date" 
              id="date" 
              formControlName="date"
              class="form-control"
              [class.is-invalid]="sessionForm.get('date')?.invalid && sessionForm.get('date')?.touched"
            >
          </div>

          <div class="form-group">
            <label for="startTime">Start Time</label>
            <input 
              type="time" 
              id="startTime" 
              formControlName="startTime"
              class="form-control"
              [class.is-invalid]="sessionForm.get('startTime')?.invalid && sessionForm.get('startTime')?.touched"
            >
          </div>

          <div class="form-group">
            <label for="endTime">End Time</label>
            <input 
              type="time" 
              id="endTime" 
              formControlName="endTime"
              class="form-control"
              [class.is-invalid]="sessionForm.get('endTime')?.invalid && sessionForm.get('endTime')?.touched"
            >
          </div>

          <div class="form-group">
            <label for="type">Session Type</label>
            <select 
              id="type" 
              formControlName="type"
              class="form-control"
              [class.is-invalid]="sessionForm.get('type')?.invalid && sessionForm.get('type')?.touched"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
            </select>
          </div>

          <div class="form-group">
            <label for="pickupCost">Pickup Cost</label>
            <input 
              type="number" 
              id="pickupCost" 
              formControlName="pickupCost"
              class="form-control"
              [class.is-invalid]="sessionForm.get('pickupCost')?.invalid && sessionForm.get('pickupCost')?.touched"
            >
          </div>

          <div formArrayName="additionalCosts">
            <h3>Additional Costs</h3>
            <button type="button" class="btn" (click)="addAdditionalCost()">Add Cost</button>
            
            <div *ngFor="let cost of additionalCosts.controls; let i=index" [formGroupName]="i" class="additional-cost">
              <div class="form-group">
                <label>Description</label>
                <input type="text" formControlName="description" class="form-control">
              </div>
              <div class="form-group">
                <label>Amount</label>
                <input type="number" formControlName="amount" class="form-control">
              </div>
              <button type="button" class="btn btn-delete" (click)="removeAdditionalCost(i)">Remove</button>
            </div>
          </div>

          <button type="submit" class="btn" [disabled]="sessionForm.invalid">
            {{ editMode ? 'Update' : 'Add' }} Session
          </button>
        </form>
      </div>

      <div class="card">
        <h2>Sessions List</h2>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Child</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Total Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let session of sessions">
                <td>{{ session.child?.name }}</td>
                <td>{{ session.date | date }}</td>
                <td>{{ session.startTime | date:'shortTime' }} - {{ session.endTime | date:'shortTime' }}</td>
                <td>{{ session.type }}</td>
                <td>€{{ calculateTotalCost(session) }}</td>
                <td>
                  <button class="btn btn-edit" (click)="editSession(session)">Edit</button>
                  <button class="btn btn-delete" (click)="deleteSession(session._id!)">Delete</button>
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
    .additional-cost {
      border: 1px solid #ddd;
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
    }
  `]
})
export class SessionsComponent implements OnInit {
  sessions: Session[] = [];
  children: Child[] = [];
  sessionForm: FormGroup;
  editMode = false;
  currentSessionId: string | null = null;

  constructor(
    private sessionService: SessionService,
    private childService: ChildService,
    private fb: FormBuilder
  ) {
    this.sessionForm = this.fb.group({
      childId: ['', [Validators.required]],
      date: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      type: ['hourly', [Validators.required]],
      pickupCost: [0, [Validators.required, Validators.min(0)]],
      additionalCosts: this.fb.array([])
    });
  }

  get additionalCosts() {
    return this.sessionForm.get('additionalCosts') as FormArray;
  }

  ngOnInit(): void {
    this.loadSessions();
    this.loadChildren();
  }

  loadSessions(): void {
    this.sessionService.getSessions().subscribe({
      next: (sessions) => this.sessions = sessions,
      error: (error) => console.error('Error loading sessions:', error)
    });
  }

  loadChildren(): void {
    this.childService.getChildren().subscribe({
      next: (children) => this.children = children,
      error: (error) => console.error('Error loading children:', error)
    });
  }

  addAdditionalCost(): void {
    const costGroup = this.fb.group({
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]]
    });
    this.additionalCosts.push(costGroup);
  }

  removeAdditionalCost(index: number): void {
    this.additionalCosts.removeAt(index);
  }

  calculateTotalCost(session: Session): number {
    const additionalCostsTotal = session.additionalCosts.reduce((sum, cost) => sum + cost.amount, 0);
    return session.pickupCost + additionalCostsTotal;
  }

  onSubmit(): void {
    if (this.sessionForm.valid) {
      const sessionData = {
        ...this.sessionForm.value,
        startTime: new Date(`${this.sessionForm.value.date}T${this.sessionForm.value.startTime}`),
        endTime: new Date(`${this.sessionForm.value.date}T${this.sessionForm.value.endTime}`)
      };
      
      if (this.editMode && this.currentSessionId) {
        sessionData._id = this.currentSessionId;
        this.sessionService.updateSession(sessionData).subscribe({
          next: () => {
            this.loadSessions();
            this.resetForm();
          },
          error: (error) => console.error('Error updating session:', error)
        });
      } else {
        this.sessionService.addSession(sessionData).subscribe({
          next: () => {
            this.loadSessions();
            this.resetForm();
          },
          error: (error) => console.error('Error adding session:', error)
        });
      }
    }
  }

  editSession(session: Session): void {
    this.editMode = true;
    this.currentSessionId = session._id!;
    
    // Clear existing additional costs
    while (this.additionalCosts.length) {
      this.additionalCosts.removeAt(0);
    }
    
    // Add existing additional costs
    session.additionalCosts.forEach(cost => {
      this.additionalCosts.push(this.fb.group({
        description: [cost.description],
        amount: [cost.amount]
      }));
    });

    this.sessionForm.patchValue({
      childId: session.childId,
      date: new Date(session.date).toISOString().split('T')[0],
      startTime: new Date(session.startTime).toTimeString().slice(0,5),
      endTime: new Date(session.endTime).toTimeString().slice(0,5),
      type: session.type,
      pickupCost: session.pickupCost
    });
  }

  deleteSession(id: string): void {
    if (confirm('Are you sure you want to delete this session?')) {
      this.sessionService.deleteSession(id).subscribe({
        next: () => this.loadSessions(),
        error: (error) => console.error('Error deleting session:', error)
      });
    }
  }

  resetForm(): void {
    this.sessionForm.reset({
      type: 'hourly',
      pickupCost: 0
    });
    while (this.additionalCosts.length) {
      this.additionalCosts.removeAt(0);
    }
    this.editMode = false;
    this.currentSessionId = null;
  }
}