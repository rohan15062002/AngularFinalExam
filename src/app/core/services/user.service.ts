import { Injectable } from '@angular/core';
import { FireStoreService } from './firestore.service';
import { User } from '../../app.model';
import { collection, query, where } from 'firebase/firestore';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private users: User[] = [];
  userLoading = false;

  constructor(private firestoreService: FireStoreService,private firestore:Firestore) {
    this.userLoading = true;
    this.fetchUsers()
      .then(
        (users) => {
          this.setUser(users);
        },
        (error) => {
          console.log('Error:', error);
        }
      )
      .finally(() => {
        this.userLoading = false;
      });
  }

  fetchUsers() {
    return this.firestoreService.getCollection('users');
  }

  setUser(users: User[]) {
    this.users = users;
  }

  getMembers() {
    return this.users.filter((user) => user.role === 'member');
  }

  getAllUsers() {
    return this.users;
  }

  getUserById(id: string) {
    return this.users.find((user) => user.uid === id);
  }

  getUserByIdObservable(id:string){
    const tasksRef = collection(this.firestore, 'users');
    const q = query(tasksRef, where('uid', '==', id));
    return collectionData(q, { idField: 'firebaseId' }) as Observable<User[]>;
  }

  updateUserRole(id: string, role: 'admin' | 'member') {
    const user = this.users.find((user) => user.uid === id);
    if (user) {
      user.role = role;
    }
    return this.firestoreService.updateDocument(`users/${id}`, user);
  }

}