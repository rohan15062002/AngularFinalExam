import { Injectable } from '@angular/core';
import { NewTask,Task } from '../../app.model';
import { FireStoreService } from './firestore.service';
import { Observable } from 'rxjs';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { collectionData, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasks: Task[] = [];
  tasksLoading = true;

  constructor(private firestoreService: FireStoreService,private firestore: Firestore) {
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

  getTasksObservable(): Observable<Task[]> {
    const productsRef = collection(this.firestore, 'tasks');
    return collectionData(productsRef, { idField: 'id' }) as Observable<Task[]>;
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

  getTaskByIdObservable(id:string):Observable<Task[]>{
    const tasksRef = collection(this.firestore, 'tasks');
    const q = query(tasksRef, where('id', '==', id));
    console.log(id,"hfhdh")
    return collectionData(q, { idField: 'firebaseId' }) as Observable<Task[]>;
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
        console.log(index,"indecx")
        this.tasks[index] = task;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
