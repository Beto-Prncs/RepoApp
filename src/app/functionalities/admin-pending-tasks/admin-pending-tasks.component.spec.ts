import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPendingTasksComponent } from './admin-pending-tasks.component';

describe('AdminPendingTasksComponent', () => {
  let component: AdminPendingTasksComponent;
  let fixture: ComponentFixture<AdminPendingTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPendingTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPendingTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
