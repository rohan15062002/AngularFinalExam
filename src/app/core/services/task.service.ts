import { Injectable } from '@angular/core';
import { NewTask,Task } from '../../app.model';
import { FireStoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasks: Task[] = [];
  tasksLoading = true;

  constructor(private firestoreService: FireStoreService) {
    this.fetchTasks()
      .then(
        (tasks) => {
          this.tasks = tasks;
        },
        (error) => {
          console.log('Error:', error);
        }
      )
      .finally(() => {
        this.tasksLoading = false;
      });
  }

  fetchTasks() {
    return this.firestoreService.getCollection('tasks');
  }

  setTasks(tasks: Task[]) {
    this.tasks = tasks;
  }

  getTasks() {
    return this.tasks;
  }

  getTaskById(id: string) {
    return this.firestoreService.getDocument(`tasks/${id}`)
  }

  addtask(task: NewTask) {
    return this.firestoreService.addDocument('tasks', task);
  }

  deleteTask(id: string) {
    return this.firestoreService.deleteDocument(`tasks/${id}`);
  }

  updateTask(task: Task) {
    return this.firestoreService.updateDocument(`tasks/${task.id}`, task).then(
      () => {
        const index = this.tasks.findIndex((t) => t.id === task.id);
        this.tasks[index] = task;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
