import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task, User } from '../../app.model';
import { UsersService } from '../../core/services/user.service';
import { TasksService } from '../../core/services/task.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { AuthService } from '../../core/services/fireauth.service';


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
  pendingTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];
  tasks:Task[]=[];
  constructor(
    private router: Router,
    private usersService: UsersService,
    private taskService: TasksService,
    private authService:AuthService
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

    this.taskService.getTasksObservable().subscribe((tasks:Task[])=>{
      this.tasks=tasks;
      console.log(this.tasks,"heklo")
      this.categorizeTasks(); 
      this.loading = false;
    })
  }

  categorizeTasks() {
    const userId = this.authService.getUserId();
    const allTasks = this.tasks.filter((t)=>t.assignedTo===userId);
    this.pendingTasks = allTasks.filter(task => task.status.toLowerCase() === 'pending');
    this.inProgressTasks = allTasks.filter(task => task.status.toLowerCase() === 'in-progress');
    this.completedTasks = allTasks.filter(task => task.status.toLowerCase() === 'completed');
  }
  
  getAssignedUserName(userId: string): string {
    const user = this.usersService.getUserById(userId);  
    return user ? user.name : 'Unknown User';
  }

   viewTask(id:string){
    return this.router.navigateByUrl(`view/${id}`)
   }
  

   updateTask(id:string){
    return this.router.navigateByUrl(`member/task/${id}`)
   }
}