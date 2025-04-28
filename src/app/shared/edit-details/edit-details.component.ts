import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/fireauth.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-details',
  standalone: true,
  imports: [ReactiveFormsModule,NavbarComponent,CommonModule],
  templateUrl: './edit-details.component.html',
  styleUrl: './edit-details.component.css'
})
export class EditDetailsComponent {
  editForm!: FormGroup;
  role:string="";
  
  constructor(private fb: FormBuilder,private authService:AuthService,private router:Router) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });

    // Optionally, pre-fill form with user data for editing
    this.loadUserData();
  }

  loadUserData(): void {
    // Example user data - replace with real data fetching logic
    const user = this.authService.currentUser;
    if(user){
    const userData = {
      name: user?.name,
      email: user?.email,
      role: user?.role,
    };
    console.log("UserData",this.authService.currentUser)
    console.log("Current User Object:", userData);
    this.role = user?.role;
    this.editForm.patchValue(userData);
  }
  }
  
  onSubmit(): void {
    console.log(this.editForm.valid)
    if (this.editForm.valid) {
      this.authService.updateUser(this.editForm.value);
      console.log('Updated User Data:', this.editForm.value);
      if(this.role!=this.editForm.value.role){
        alert("User Updated Successfully")
        this.authService.logout();
      }
      this.router.navigateByUrl(`dashboard/${this.role}`)
    } else {
      this.editForm.markAllAsTouched(); 
    }
  }

}
