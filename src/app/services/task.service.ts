import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  assignedTo: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  getTasksByUser(userId: string): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.assignedTo === userId))
    );
  }

  assignTask(task: Task): void {
    const currentTasks = this.tasksSubject.getValue();
    this.tasksSubject.next([...currentTasks, task]);
  }

  completeTask(taskId: string): void {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.map(task => 
      task.id === taskId ? {...task, status: 'completed'} : task
    );
    this.tasksSubject.next([...updatedTasks]);
  }

  deleteTask(taskId: string): void {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);
    this.tasksSubject.next([...updatedTasks]);
  }
}