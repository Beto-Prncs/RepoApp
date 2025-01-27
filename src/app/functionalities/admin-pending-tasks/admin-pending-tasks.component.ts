import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'completed';
  createdAt: Date;
}

interface Worker {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-admin-pending-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pending-tasks.component.html',
  styleUrls: ['./admin-pending-tasks.component.css']
})
export class AdminPendingTasksComponent implements OnInit {
  workers: Worker[] = [
    { id: '1', name: 'Alberto Castro', email: 'beto123@test.com' },
    { id: '2', name: 'Ana López', email: 'ana@example.com' }
  ];

  pendingTasks: Task[] = [];

  newTask = {
    title: '',
    description: '',
    assignedTo: ''
  };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadPendingTasks();
  }

  loadPendingTasks() {
    // Simulated data - replace with actual API call
    this.pendingTasks = [
      {
        id: '1',
        title: 'Revisión de equipos',
        description: 'Realizar revisión mensual de equipos',
        assignedTo: '1',
        status: 'pending',
        createdAt: new Date()
      }
    ];
  }

  assignTask() {
    if (!this.isFormValid()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: this.newTask.title,
      description: this.newTask.description,
      assignedTo: this.newTask.assignedTo,
      status: 'pending',
      createdAt: new Date()
    };

    // Agregar la tarea al array local
    this.pendingTasks.unshift(task);
    
    // Enviar la tarea al servicio
    this.taskService.assignTask(task);
    
    // Resetear el formulario
    this.resetForm();
  }

  editTask(task: Task) {
    // Implement edit functionality
  }

  deleteTask(taskId: string) {
    this.pendingTasks = this.pendingTasks.filter(task => task.id !== taskId);
  }

  getWorkerName(workerId: string): string {
    return this.workers.find(w => w.id === workerId)?.name || 'No asignado';
  }

  isFormValid(): boolean {
    return this.newTask.title.trim() !== '' && 
           this.newTask.description.trim() !== '' && 
           this.newTask.assignedTo !== '';
  }

  resetForm() {
    this.newTask = {
      title: '',
      description: '',
      assignedTo: ''
    };
  }
}