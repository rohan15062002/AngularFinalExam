import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  UserCredential,
  User,
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
// import { UserService } from './user.service';

interface CurrentUser {
  uid: string;
  name:string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: CurrentUser | null = null;
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    const user = sessionStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  async getUserData(email: string): Promise<any> {
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }

    return null;
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const res: UserCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      if (res.user?.emailVerified === false) {
        throw new Error('Please verify your email address to login.');
      }
      const user = await this.getUserData(email);
      this.currentUser = user;
      sessionStorage.setItem('user', JSON.stringify(user));

      return res.user;
    } catch (error: any) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async register(name: string, email: string, password: string, role: string): Promise<void> {
    const userExists = await this.getUserData(email);
    if (userExists) {
      throw new Error('User already exists. Please login.');
    }

    try {
      const res = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const usersCollection = collection(this.firestore, 'users');

      const userDocRef = doc(usersCollection, res.user.uid);
      await setDoc(userDocRef, {
        uid: res.user.uid,
        name,
        email,
        role,
      });

      const isVerified = await this.sendEmailForVerification(res.user);
    } catch (error: any) {
      throw new Error(` ${error.message}`);
    }
  }

  async sendEmailForVerification(user: User): Promise<boolean> {
    let res = false;
    await sendEmailVerification(user)
      .then(() => {
        alert('Verification email sent!, Please verify your email address.');
        res = true;
      })
      .catch(() => {
        alert('Unable to send verification email.');
        res = false;
      });
    return res;
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      sessionStorage.removeItem('user');
      this.currentUser = null;
      console.log('Logged out');

      this.router.navigate(['/login']);
    } catch (error: any) {
      alert(` ${error.message}`);
    }
  }

  async updateUser(updatedUserData: CurrentUser) {
    const uid = this.currentUser?.uid;
    console.log(updatedUserData,"updated")
    const userRef = collection(this.firestore, `users`);
    const q = query(userRef, where('email', '==', this.currentUser?.email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error('User not found with this email');
    }

    const userDoc = querySnapshot.docs[0]; // assuming email is unique
    console.log(userDoc.id)
    const userDocRef = doc(this.firestore, 'users', userDoc.id);
    await setDoc(userDocRef, { ...updatedUserData,uid: uid});
  }

  getLoggedInUser(): User | null {
    return this.auth.currentUser;
  }

  isUserLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getUserRole(): string | null {
    return this.currentUser?.role || null;
  }

  getUserId() {
    return this.currentUser?.uid || null;
  }

  getUserName():string|null{
    return this.currentUser?.name || null;
  }
}
