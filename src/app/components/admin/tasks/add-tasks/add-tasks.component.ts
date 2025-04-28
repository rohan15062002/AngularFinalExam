import { Component } from '@angular/core';
import { UsersService } from '../../../../core/services/user.service';
import { TasksService } from '../../../../core/services/task.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewTask } from '../../../../app.model';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-add-tasks',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,NavbarComponent],
  templateUrl: './add-tasks.component.html',
  styleUrl: './add-tasks.component.css'
})
export class AddTasksComponent {
  addTaskForm = new FormGroup({
    taskName: new FormControl('', {
      validators: [Validators.required],
    }),
    projectDescription: new FormControl('', {
      validators: [Validators.required],
    }),
    assignedTo: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  submitted = false;
  isLoading = false;

  constructor(
    private userService: UsersService,
    private taskService: TasksService,
    private router: Router
  ) {}

  get members() {
    return this.userService.getMembers();
  }


  onSubmit() {
    this.submitted = true;
    if (!this.addTaskForm.valid) {
      return;
    }
    const task: NewTask = {
      title: this.addTaskForm.value.taskName!,
      projectDescription: this.addTaskForm.value.projectDescription!,
      assignedTo: this.addTaskForm.value.assignedTo!,
      status: 'pending',
    };
    this.isLoading = true;
    this.taskService
      .addtask(task)
      .then(
        () => {
          console.log('Task added successfully');
          this.router.navigate(['dashboard/admin']);
        },
        (error) => {
          console.error('Error adding task:', error);
        }
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
