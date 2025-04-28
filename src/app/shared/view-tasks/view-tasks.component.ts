import { Component, Input } from '@angular/core';

import { CommonModule, NgFor, NgIf } from '@angular/common';
import { TasksService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/fireauth.service';
import { UsersService } from '../../core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../app.model';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-view-task',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './view-tasks.component.html',
  styleUrls: ['./view-tasks.component.css'],
})
export class ViewTaskComponent {
  @Input() id!: string;

  task!:Task;
  taskId!: string;
  loading=false;
  role:string|null="";

  constructor(
    private taskService: TasksService,
    private authService: AuthService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.taskId = this.activatedRoute.snapshot.params['id'];
    console.log(this.taskId)

       this.loading=true;
       this.role = this.authService.getUserRole();
       this.taskService.getTaskById(this.taskId).then((task)=>{
        if(!task){
          this.router.navigateByUrl(`/dashboard/${this.role}`);
        }

        const res: Task = task as Task;
        console.log(res,"result")
        this.task = res;
        console.log(this.task,"task")
       },(error)=>{
        console.log('Error:', error);
       }).finally(()=>{
        this.loading=false;
       })
    
    
  }
  
  goHome(){
    return this.router.navigateByUrl(`dashboard/${this.role}`)
  }

  
}
