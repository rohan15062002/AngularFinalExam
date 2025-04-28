import { Component } from '@angular/core';
import { UsersService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/fireauth.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-manage-user-role',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './manage-user-role.component.html',
  styleUrl: './manage-user-role.component.css'
})
export class ManageUserRoleComponent {
  loading = false;
  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) {}

  get currentUserId() {
    return this.authService.getUserId();
  }

  get admins() {
    return this.userService
      .getAllUsers()
      .filter((user) => user.role === 'admin');
  }

  get members() {
    return this.userService.getMembers();
  }

  handleMakeUser(userId: string) {
    console.log('User ID:', userId);
    this.loading = true;
    this.userService
      .updateUserRole(userId, 'member')
      .then(
        () => {
          console.log('User role updated successfully');
        },
        (error) => {
          console.log('Error:', error);
        }
      )
      .finally(() => {
        this.loading = false;
      });
  }

  handleMakeAdmin(userId: string) {
    console.log('User ID:', userId);
    this.loading = true;
    this.userService
      .updateUserRole(userId, 'admin')
      .then(
        () => {
          console.log('User role updated successfully');
        },
        (error) => {
          console.log('Error:', error);
          
        }
      )
      .finally(() => {
        this.loading = false;
      });
  }
}
