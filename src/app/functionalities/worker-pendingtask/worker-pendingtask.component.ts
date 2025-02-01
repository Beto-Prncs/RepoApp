import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TaskService, Task, TaskCompletion } from '../../services/task.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-worker-pendingtask',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './worker-pendingtask.component.html',
  styleUrl:'./worker-pendingtask.component.css'
})
export class WorkerPendingtaskComponent implements OnInit {
  pendingTasks$: Observable<Task[]>;
  selectedTask: Task | null = null;
  completionForm: TaskCompletion = {
    workerName: '',
    workerPosition: '',
    companyName: '',
    companyAddress: '',
    finalStatus: '',
    materialsUsed: [],
    completionDate: new Date()
  };

  constructor(private taskService: TaskService) {
    this.pendingTasks$ = this.taskService.getTasks().pipe(
      map(tasks => tasks.filter(t => t.status === 'pending'))
    );
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  openCompletionForm(task: Task) {
    this.selectedTask = task;
  }

  addMaterial() {
    this.completionForm.materialsUsed.push('');
  }

  removeMaterial(index: number) {
    this.completionForm.materialsUsed.splice(index, 1);
  }

  completeTask() {
    if (!this.selectedTask) return;

    this.taskService.completeTask(this.selectedTask.id);
    alert('¡Tarea completada correctamente!');
    this.cancelCompletion();
  }

  cancelCompletion() {
    this.selectedTask = null;
    this.completionForm = {
      workerName: '',
      workerPosition: '',
      companyName: '',
      companyAddress: '',
      finalStatus: '',
      materialsUsed: [],
      completionDate: new Date()
    };
  }
}