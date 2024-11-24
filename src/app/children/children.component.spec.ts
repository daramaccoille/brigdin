import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildrenComponent } from './children.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('ChildrenComponent', () => {
  let component: ChildrenComponent;
  let fixture: ComponentFixture<ChildrenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChildrenComponent],
      imports: [CommonModule, ReactiveFormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
