import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-worker-pendingtask',
  templateUrl: './worker-pendingtask.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class WorkerPendingtaskComponent implements OnInit {
  pendingTasks$: Observable<Task[]>;

  constructor(private taskService: TaskService) {
    this.pendingTasks$ = this.taskService.getTasks().pipe(
      map((tasks: Task[]) => tasks.filter(t => t.status === 'pending'))
    );
  }

  ngOnInit() {}
}