import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task, User } from '../../app.model';
import { UsersService } from '../../core/services/user.service';
import { TasksService } from '../../core/services/task.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';


@Component({
  selector: 'app-member',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './member.component.html',
  styleUrl: './member.component.css'
})
export class MemberComponent  {
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
  
  getAssignedUserName(userId: string): string {
    const user = this.usersService.getUserById(userId);  // you need to write this function in UsersService
    return user ? user.name : 'Unknown User';
  }

   viewTask(id:string){
    return this.router.navigateByUrl(`view/${id}`)
   }
  

   updateTask(id:string){
    return this.router.navigateByUrl(`member/task/${id}`)
   }
}