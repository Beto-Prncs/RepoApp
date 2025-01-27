import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-worker-pendingtask',
  templateUrl: './worker-pendingtask.component.html'
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