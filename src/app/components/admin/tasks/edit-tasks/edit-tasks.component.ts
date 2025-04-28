import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../../core/services/user.service';
import { TasksService } from '../../../../core/services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { Task } from '../../../../app.model';
import { AuthService } from '../../../../core/services/fireauth.service';

@Component({
  selector: 'app-edit-tasks',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,NavbarComponent],
  templateUrl: './edit-tasks.component.html',
  styleUrl: './edit-tasks.component.css'
})
export class EditTasksComponent {
  submitted = false;
  isLoading = false;
  id: string;
  editTaskForm!: FormGroup;
  taskDetails!: Task;

  constructor(
    private userService: UsersService,
    private taskService: TasksService,
    private authService:AuthService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {

    this.isLoading=true;
    this.id = this.activeRoute.snapshot.paramMap.get('id')!;

    this.taskService.getTaskById(this.id).then((task)=>{
      if(!task){
        this.router.navigate(['dashboard/admin']);
      }

      const res: Task = task as Task;
      this.taskDetails=res;

      this.editTaskForm = new FormGroup({
        taskName: new FormControl(this.taskDetails?.title, {
          validators: [Validators.required],
        }),
        projectDescription: new FormControl(this.taskDetails?.projectDescription, {
          validators: [Validators.required],
        }),
        assignedTo: new FormControl(this.taskDetails?.assignedTo, {
          validators: [Validators.required],
        }),
        comment: new FormControl(''),
      });
      console.log(res)

    },
    (error)=>{
      console.log('Error:', error);
    }
    ).finally(()=>{
      this.isLoading = false;
    });

    // console.log(this.editTaskForm.value)
  }

  get members() {
    return this.userService.getMembers();
  }


  onSubmit() {
    this.submitted = true;
    if (this.editTaskForm.invalid) {
      return;
    }

    // Get existing comments or empty
  const existingComments = this.taskDetails?.comments ?? [];

  // If user added a comment, add it to the array
  const commentText = this.editTaskForm.value.comment?.trim();
  if (commentText) {
    existingComments.push({
      text: commentText,
      author: this.authService.getUserName() || ''
    });
  }


    const task = {
      id: this.id,
      title: this.editTaskForm.value.taskName!,
      projectDescription: this.editTaskForm.value.projectDescription!,
      assignedTo: this.editTaskForm.value.assignedTo!,
      status: this.taskDetails?.status!,
      comments: this.taskDetails?.comments ?? [],
    };
    this.isLoading = true;

    this.taskService
      .updateTask(task)
      .then(
        () => {
          console.log('Task updated successfully');
          this.router.navigate(['/dashboard/admin'], { replaceUrl: true });
        },
        (error: any) => {
          console.log('Error:', error);
        }
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

}
