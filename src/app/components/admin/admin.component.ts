import { Component } from '@angular/core';
import { Task, User } from '../../app.model';
import { Router } from '@angular/router';
import { UsersService } from '../../core/services/user.service';
import { TasksService } from '../../core/services/task.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  loading = false;
  users: User[] = [];
  constructor(
    private router: Router,
    private usersService: UsersService,
    private taskService: TasksService
  ) {}

  ngOnInit(){
    this.loading = true;
    this.usersService.fetchUsers().then(
      (users) => {
        this.usersService.setUser(users);
      },
      (error) => {
        console.log('Error:', error);
      }
    );

    this.taskService
      .fetchTasks()
      .then(
        (tasks) => {
          this.taskService.setTasks(tasks);
        },
        (error) => {
          console.log('Error:', error);
        }
      )
      .finally(() => {
        this.loading = false;
      });
  }

  get tasks() {
    return this.taskService.getTasks();
  }

  addTask(){
    return this.router.navigateByUrl('admin/add')
   }

   manageUsers(){
    console.log("All Task")
    this.router.navigateByUrl('admin/manage-users')
   }

   deleteTask(task: Task) {
    const id = task.id;
    
    const confirmDelete = confirm('Are you sure you want to delete this task?');
    
    if (confirmDelete) {
      console.log("Incident deleted", id);
      this.loading=true;
      this.taskService.deleteTask(id).then(() => {
        console.log('Task deleted successfully');
        this.taskService.fetchTasks().then(tasks => {
          this.taskService.setTasks(tasks);
        });
      }).finally(()=>{
        this.loading=false;
      });
    } else {
      console.log('Task deletion cancelled.');
    }
  }
  

   editTask(id:string){
    return this.router.navigateByUrl(`admin/edit/${id}`)
   }
}

