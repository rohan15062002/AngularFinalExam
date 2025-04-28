import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/fireauth.service';
import { Router, RouterLink } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private firestore:Firestore,
    private fireauth: AuthService,
    private router: Router
    ){}

  registerForm = new FormGroup({
    username: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required,Validators.minLength(6)]),
    role: new FormControl('',Validators.required),
  })

  async onSubmit() {
    if (this.registerForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }
  
    const { username, email, password,role } = this.registerForm.value;

    
  
    try {
      await this.register(username!,email!, password!,role!);
      this.registerForm.reset();
    } catch (error: any) {
      alert(`Registration failed: ${error.message}`);
    }
  }
  
  private async register(username:string,email: string, password: string,role: string) {
    if (!role || (role !== 'admin' && role !== 'member')) {
      alert('Please select a valid role: admin or member.');
      return;
    }
    console.log({username,email,password,role})
  
    try {
      await this.fireauth.register(username,email, password, role); 
      this.router.navigateByUrl('/login');
    } catch (error: any) {
      throw error; 
    }
  }
}