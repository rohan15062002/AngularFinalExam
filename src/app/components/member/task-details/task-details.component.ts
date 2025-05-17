import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Task } from '../../../app.model';
import { TasksService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/services/fireauth.service';
import { UsersService } from '../../../core/services/user.service';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,NavbarComponent],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent {
  showEditTaskDialog = false;
  taskStatusForm!: FormGroup;
  commentForm!: FormGroup;
  id!: string;
  isUpdating = false;
  taskDetails: Task | null = null;
  loading = true;

  constructor(
    private taskService: TasksService,
    private authService: AuthService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.taskStatusForm = new FormGroup({
      status: new FormControl('', Validators.required),
    });
    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required),
    });
  }

  async ngOnInit() {
    try {
      const task = await this.taskService.getTaskById(this.id);
      if (task) {
        this.taskDetails = task as Task;
        this.taskStatusForm.patchValue({
          status: this.taskDetails.status
        });
      } else {
        this.router.navigate(['member']);
      }
    } catch (error) {
      console.error('Error loading task:', error);
    } finally {
      this.loading = false;
    }
  }

  get isLoading() {
    return this.loading || this.taskService.tasksLoading;
  }

  get userName() {
    const userId = this.authService.getUserId();
    return this.userService.getUserById(userId!)?.name;
  }


  async onUpdateStatus() {
    if (!this.taskDetails ) return;
    const comments = this.taskDetails.comments || [];
    if(!this.commentForm){
      return
    }
    
    this.isUpdating = true;
    try {
      await this.taskService.updateTask({
        ...this.taskDetails,
        status: this.taskStatusForm.value.status,
        id:this.id
      });
      console.log('Task status updated successfully');
      alert('Task status updated successfully')
      this.router.navigateByUrl('dashboard/member')
    } catch (error) {
      console.log('Error updating task status', error);
    } finally {
      this.isUpdating = false;
    }
  }

  async onAddComment() {
    if (!this.taskDetails) return;

    const newComment = {
      text: this.commentForm.value.text,
      author: this.userName || 'Unknown',
    };
    
    const comments = this.taskDetails.comments || [];
    const updatedTask = {
      ...this.taskDetails,
      comments: [...comments, newComment],
    };

    try {
      await this.taskService.updateTask(updatedTask);
      this.commentForm.reset();
      this.taskDetails = updatedTask; // Update local state
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }
}
