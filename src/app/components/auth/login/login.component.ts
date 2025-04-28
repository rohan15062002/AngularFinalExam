import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/fireauth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FireStoreService } from '../../../core/services/firestore.service';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor( 
    private fireauth: AuthService,
    private firestore: Firestore,
    private router: Router){}

  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required,Validators.minLength(6)])
  })

  async onSubmit() {
    if (!this.loginForm.valid) {
      alert("Fill all the entries");
      this.loginForm.reset();
      return;
    }
  
    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;
  
    try {
      await this.login(email, password);  
    } catch (error: any) {
      alert(`Login failed: ${error.message}`);
    }
  }
  

private async login(email: string, password: string) {
  try {
    const loggedInUser = await this.fireauth.login(email, password);

    if (loggedInUser?.uid) {
      const usersCollection = collection(this.firestore,'users');
      const userQuery = query(
        usersCollection,
        where('uid', '==', loggedInUser.uid)
      );
      const snapshot = await getDocs(userQuery);

      if (!snapshot.empty) {
        const userData: any = snapshot.docs[0].data();
        if (userData.role === 'admin') {
          this.router.navigate(['/dashboard/admin']);
        } else if (userData.role === 'member') {
          this.router.navigate(['/dashboard/member']);
        } else {
          alert('Unknown role. Please contact support.');
        }
      } else {
        alert('User not found in Firestore.');
      }
    } else {
      alert('Login failed: Unable to fetch user details.');
      this.router.navigateByUrl("register")
    }
  } catch (error: unknown) {
    alert(`Login failed: ${(error as Error).message}`);
    this.router.navigateByUrl('register')
  }
}
}